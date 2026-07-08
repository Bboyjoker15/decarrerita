const { Router } = require("express");
const revisionController = require("../controllers/revisionVehiculoController");
const revisionValidator = require("../validators/revisionVehiculoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", revisionController.listar);
router.get("/vehiculo/:id", revisionController.listarPorVehiculo);
router.post("/", revisionValidator.crear, validate, revisionController.crear);
router.get("/:id", revisionController.obtenerPorId);
router.put("/:id", revisionValidator.actualizar, validate, revisionController.actualizar);

module.exports = router;
