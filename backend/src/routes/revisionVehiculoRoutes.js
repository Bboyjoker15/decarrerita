const { Router } = require("express");
const revisionController = require("../controllers/revisionVehiculoController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", revisionController.listar);
router.post("/", revisionController.crear);
router.get("/:id", revisionController.obtenerPorId);
router.put("/:id", revisionController.actualizar);

module.exports = router;
