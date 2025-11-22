// server/index-dev.ts
import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";
import { nanoid } from "nanoid";
import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";

import viteConfig from "../vite.config";
import runApp from "./app";

// Dev setup function for runApp
export async function setupVite(app: Express, server: Server): Promise<void> {
  const viteLogger = createLogger();
  const viteServer = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  // Use Vite middleware
  app.use(viteServer.middlewares);

  // Serve index.html dynamically for HMR
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (err) {
      viteServer.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}

// Run the app
(async () => {
  await runApp(setupVite);
})();
