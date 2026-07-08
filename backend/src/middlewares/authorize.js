const MENSAJES = require("../constants/mensajes");
const { error } = require("../utils/apiResponse");

function authorize(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, MENSAJES.AUTH.TOKEN_REQUERIDO, 401);
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return error(res, MENSAJES.GENERAL.NO_AUTORIZADO, 403);
    }

    next();
  };
}

module.exports = authorize;
