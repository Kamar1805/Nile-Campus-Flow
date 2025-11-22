// api/index.ts
import serverless from "serverless-http";
import { app, setupRoutes } from "../server/app";

(async () => {
  await setupRoutes(app);
})();