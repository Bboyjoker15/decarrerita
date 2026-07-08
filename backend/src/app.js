require("./config/environment");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const prisma = require("./config/database");
const MENSAJES = require("./constants/mensajes");
const { error: errorResponse } = require("./utils/apiResponse");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "Decarrerita API funcionando" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  errorResponse(res, MENSAJES.GENERAL.RUTA_NO_ENCONTRADA, 404);
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  errorResponse(res, MENSAJES.GENERAL.ERROR_INTERNO, 500);
});

module.exports = app;
