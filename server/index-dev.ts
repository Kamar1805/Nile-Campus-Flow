// server/index-dev.ts
import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";
import { type Express } from "express";
import { createServer as createViteServer } from "vite";
import runApp from "./app";
import viteConfig from "../vite.config";

export async function setupVite(app: Express, server: Server): Promise<void> {
  const viteServer = await createViteServer({
    ...viteConfig,
    server: {
      middlewareMode: true,
      hmr: { server },
      open: false,
    },
    appType: "custom",
    configFile: false,
  });

  // Use Vite's middleware
  app.use(viteServer.middlewares);

  // Serve index.html dynamically for HMR
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const clientIndex = path.resolve("client/index.html");
      let template = await fs.promises.readFile(clientIndex, "utf-8");
      const html = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      viteServer.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}

// Start dev server
(async () => {
  await runApp(setupVite);
})();
