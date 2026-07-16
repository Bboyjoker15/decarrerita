const { Router } = require("express");
const pruebaController = require("../controllers/pruebaPsicologicaController");
const pruebaValidator = require("../validators/pruebaPsicologicaValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO));

router.get("/", pruebaController.listar);
router.get("/chofer/:id", pruebaController.listarPorChofer);
router.post("/", pruebaValidator.crear, validate, pruebaController.crear);
router.get("/:id", pruebaController.obtenerPorId);
router.put("/:id", pruebaValidator.actualizar, validate, pruebaController.actualizar);

module.exports = router;
