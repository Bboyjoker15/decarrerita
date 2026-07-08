const MENSAJES = require("../constants/mensajes");
const { error } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
  console.error("Error no controlado:", err);

  if (err.name === "PrismaClientKnownRequestError") {
    return error(res, "Error de base de datos", 400);
  }

  if (err.name === "PrismaClientValidationError") {
    return error(res, "Datos inválidos enviados a la base de datos", 400);
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return error(res, MENSAJES.AUTH.TOKEN_INVALIDO, 401);
  }

  return error(res, MENSAJES.GENERAL.ERROR_INTERNO, 500);
}

module.exports = errorHandler;
