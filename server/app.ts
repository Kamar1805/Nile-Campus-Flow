import { type Server } from "node:http";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";

// ---------- Logging helper ----------
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${time} [${source}] ${message}`);
}

// ---------- Create Express app ----------
export const app: Express = express();

// Add rawBody property to Request type
declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

// ---------- Body parsing ----------
app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// ---------- Logging middleware ----------
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: Record<string, any> | undefined;

  const originalJson = res.json.bind(res);
  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ---------- Run app function ----------
export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>
) {
  // Register API routes and get HTTP server
  const server: Server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Unhandled error:", err);
  });

  // Run environment-specific setup (Vite dev or static prod)
  await setup(app, server);

  // Start server
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port }, () => {
    log(`Server running on port ${port}`);
  });
}
export { registerRoutes as setupRoutes } from "./routes";