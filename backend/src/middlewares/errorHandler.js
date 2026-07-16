const MENSAJES = require("../constants/mensajes");
const { error } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
  console.error("Error no controlado:", err);

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return error(res, `El valor ingresado para ${err.meta?.target?.join(", ") || "un campo unico"} ya existe`, 409);
    }
    if (err.code === "P2003") {
      return error(res, "El registro relacionado no existe (violacion de clave foranea)", 400);
    }
    if (err.code === "P2025") {
      return error(res, "El registro solicitado no fue encontrado", 404);
    }
    return error(res, "Error de base de datos", 400);
  }

  if (err.name === "PrismaClientValidationError") {
    return error(res, "Datos invalidos enviados a la base de datos", 400);
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return error(res, MENSAJES.AUTH.TOKEN_INVALIDO, 401);
  }

  return error(res, MENSAJES.GENERAL.ERROR_INTERNO, 500);
}

module.exports = errorHandler;
