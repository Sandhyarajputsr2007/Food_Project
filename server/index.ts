import "dotenv/config";

import express, { type ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { orderRouter } from "./routes/orders";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientDirectory = resolve(projectRoot, "dist/client");
const app = express();
const isProduction = process.env["NODE_ENV"] === "production";

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  const connected = mongoose.connection.readyState === 1;
  response.status(connected ? 200 : 503).json({
    ok: connected,
    database: connected ? "connected" : "disconnected",
  });
});

app.use("/api/orders", orderRouter);
app.use("/api", (_request, response) => {
  response.status(404).json({ success: false, error: "API endpoint not found." });
});

if (isProduction) {
  app.use(express.static(clientDirectory));
  app.use((request, response, next) => {
    if (request.method !== "GET") {
      next();
      return;
    }

    response.sendFile(resolve(clientDirectory, "index.html"), (error) => {
      if (error) next(error);
    });
  });
} else {
  const vite = await createViteServer({
    configFile: resolve(projectRoot, "vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const handleServerError: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error("Unhandled server error.", error);
  const isInvalidJson =
    error != null &&
    typeof error === "object" &&
    "type" in error &&
    error.type === "entity.parse.failed";
  response.status(isInvalidJson ? 400 : 500).json({
    success: false,
    error: isInvalidJson
      ? "The request body must be valid JSON."
      : "An unexpected server error occurred.",
  });
};

app.use(handleServerError);

const port = Number(process.env["PORT"] ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const server = app.listen(port, () => {
  console.info(`Chai Nashta Corner is running on port ${port}.`);
});

const mongoUri = process.env["MONGODB_URI"];
if (!mongoUri) {
  console.error("MONGODB_URI is not configured; order placement is disabled.");
} else {
  void mongoose
    .connect(mongoUri)
    .then(() => console.info("Connected to MongoDB."))
    .catch((error: unknown) => console.error("MongoDB connection failed.", error));
}

function shutDown() {
  server.close(() => {
    void mongoose.disconnect().finally(() => process.exit(0));
  });
}

process.once("SIGINT", shutDown);
process.once("SIGTERM", shutDown);
