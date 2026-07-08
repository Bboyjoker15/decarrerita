const { Router } = require("express");
const clienteController = require("../controllers/clienteController");
const clienteValidator = require("../validators/clienteValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/mi-saldo", authorize(ROLES.CLIENTE), clienteController.miSaldo);

router.get("/", authorize(ROLES.ADMIN), clienteController.listar);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.CLIENTE), clienteController.obtenerPorId);
router.put("/:id", authorize(ROLES.ADMIN, ROLES.CLIENTE), clienteValidator.actualizar, validate, clienteController.actualizar);
router.delete("/:id", authorize(ROLES.ADMIN), clienteController.eliminar);

module.exports = router;
