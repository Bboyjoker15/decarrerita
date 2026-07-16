const { Router } = require("express");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");
const userValidator = require("../validators/userValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const userService = require("../services/userService");
const { success } = require("../utils/apiResponse");

const router = Router();

router.post("/register", authValidator.register, validate, authController.register);
router.post("/register-chofer", authValidator.registerChofer, validate, authController.registerChofer);
router.post("/login", authValidator.login, validate, authController.login);
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const result = await userService.obtenerPorId(req.user.id);
    if (result.error) return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    success(res, result.data);
  } catch (err) {
    next(err);
  }
});
router.put("/me", authenticate, userValidator.actualizar, validate, async (req, res, next) => {
  try {
    const result = await userService.actualizar(req.user.id, req.body);
    if (result.error) return res.status(404).json({ ok: false, error: result.error });
    success(res, result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
