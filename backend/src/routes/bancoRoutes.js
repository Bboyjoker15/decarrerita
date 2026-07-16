const { Router } = require("express");
const bancoController = require("../controllers/bancoController");
const bancoValidator = require("../validators/bancoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO, ROLES.CLIENTE, ROLES.CHOFER), bancoController.listar);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), bancoController.obtenerPorId);
router.post("/", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), bancoValidator.crear, validate, bancoController.crear);
router.put("/:id", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), bancoValidator.actualizar, validate, bancoController.actualizar);
router.delete("/:id", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), bancoController.eliminar);

module.exports = router;
