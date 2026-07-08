const { Router } = require("express");
const pruebaController = require("../controllers/pruebaPsicologicaController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", pruebaController.listar);
router.post("/", pruebaController.crear);
router.get("/:id", pruebaController.obtenerPorId);
router.put("/:id", pruebaController.actualizar);

module.exports = router;
