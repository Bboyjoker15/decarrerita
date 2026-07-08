const { Router } = require("express");
const userController = require("../controllers/userController");
const userValidator = require("../validators/userValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", userController.listar);
router.get("/:id", userController.obtenerPorId);
router.put("/:id", userValidator.actualizar, validate, userController.actualizar);
router.delete("/:id", userController.eliminar);

module.exports = router;
