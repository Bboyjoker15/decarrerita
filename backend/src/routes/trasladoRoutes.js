const { Router } = require("express");
const trasladoController = require("../controllers/trasladoController");
const trasladoValidator = require("../validators/trasladoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/mis-traslados", authorize(ROLES.CLIENTE), trasladoController.misTraslados);
router.get("/chofer/mis-traslados", authorize(ROLES.CHOFER), trasladoController.misTrasladosChofer);

router.get("/", authorize(ROLES.ADMIN), trasladoController.listar);
router.post("/", authorize(ROLES.CLIENTE), trasladoValidator.crear, validate, trasladoController.crear);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.CLIENTE, ROLES.CHOFER), trasladoController.obtenerPorId);
router.put("/:id/estado", authorize(ROLES.CHOFER), trasladoValidator.actualizarEstado, validate, trasladoController.actualizarEstado);

module.exports = router;
