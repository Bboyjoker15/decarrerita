const { Router } = require("express");
const bancoController = require("../controllers/bancoController");
const bancoValidator = require("../validators/bancoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", bancoController.listar);
router.get("/:id", bancoController.obtenerPorId);
router.post("/", bancoValidator.crear, validate, bancoController.crear);
router.put("/:id", bancoValidator.actualizar, validate, bancoController.actualizar);
router.delete("/:id", bancoController.eliminar);

module.exports = router;
