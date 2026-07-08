const { verifyToken } = require("../utils/jwt");
const MENSAJES = require("../constants/mensajes");
const { error } = require("../utils/apiResponse");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, MENSAJES.AUTH.TOKEN_REQUERIDO, 401);
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return error(res, MENSAJES.AUTH.TOKEN_INVALIDO, 401);
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, MENSAJES.AUTH.TOKEN_INVALIDO, 401);
  }
}

module.exports = authenticate;
