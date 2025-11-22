// server/app.ts
import { type Server } from "node:http";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";

// Logging helper
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Create Express app
export const app: Express = express();

// Add rawBody property to Request type
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Body parsing
app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// Run app function
export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>
) {
  // Register routes and get HTTP server
  const server: Server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err; // optional: keep for logging in dev
  });

  // Run final setup (dev or prod)
  await setup(app, server);

  // Start server on PORT environment variable
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port }, () => {
    log(`serving on port ${port}`);
  });
}
