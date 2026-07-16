const { Router } = require("express");
const vehiculoController = require("../controllers/vehiculoController");
const vehiculoValidator = require("../validators/vehiculoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN), vehiculoController.listar);
router.get("/chofer/:id", authorize(ROLES.ADMIN, ROLES.CHOFER), vehiculoController.listarPorChofer);

router.post("/", authorize(ROLES.ADMIN), vehiculoValidator.crear, validate, vehiculoController.crear);
router.post("/me", authorize(ROLES.CHOFER), vehiculoValidator.crear, validate, vehiculoController.crearMiVehiculo);

router.get("/:id", authorize(ROLES.ADMIN, ROLES.CHOFER), vehiculoController.obtenerPorId);

router.put("/:id", authorize(ROLES.ADMIN), vehiculoValidator.actualizar, validate, vehiculoController.actualizar);

router.delete("/:id", authorize(ROLES.ADMIN), vehiculoController.eliminar);

module.exports = router;
