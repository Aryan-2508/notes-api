import express from "express";
import noteRoutes from "./routes/note.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/request-logger.middleware";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";

const app = express();

app.use(requestLogger)

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes API is running",
  });
});

app.use("/api/notes", noteRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Keep error middleware after the routes
app.use(errorMiddleware);

export default app;