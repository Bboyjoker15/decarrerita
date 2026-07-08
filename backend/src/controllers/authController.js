const authService = require("../services/authService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    if (result.error) return error(res, MENSAJES.AUTH[result.error.split(".")[1]], 400);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    if (result.error) return error(res, MENSAJES.AUTH[result.error.split(".")[1]], 401);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
