import serverless from "serverless-http";
import app from "../server/app";

export const handler = serverless(app);

// Optional: export verbs for Vercel
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
