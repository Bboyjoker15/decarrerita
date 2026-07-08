require("./config/environment");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const prisma = require("./config/database");
const MENSAJES = require("./constants/mensajes");
const { error: errorResponse } = require("./utils/apiResponse");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "Decarrerita API funcionando" });
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "conectada", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", database: "desconectada" });
  }
});

app.use("/api", routes);

app.use((req, res, next) => {
  errorResponse(res, MENSAJES.GENERAL.RUTA_NO_ENCONTRADA, 404);
});

app.use(errorHandler);

module.exports = app;
