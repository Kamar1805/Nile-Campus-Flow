// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import { createServer, type Server } from "node:http";
import express, { type Express, type Request, type Response } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve("client/dist"); // adjust if your build output is different

  if (!fs.existsSync(distPath)) {
    throw new Error(`Build folder not found at ${distPath}. Make sure you ran 'vite build'`);
  }

  // Serve all static files
  app.use(express.static(distPath));

  // Fallback to index.html for SPA routing
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Start the server
(async () => {
  await runApp(serveStatic);
})();
