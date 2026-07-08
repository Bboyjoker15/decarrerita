const { Router } = require("express");
const recargaController = require("../controllers/recargaController");
const recargaValidator = require("../validators/recargaValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/mis-recargas", authorize(ROLES.CLIENTE), recargaController.misRecargas);

router.get("/", authorize(ROLES.ADMIN), recargaController.listar);
router.post("/", authorize(ROLES.CLIENTE), recargaValidator.crear, validate, recargaController.crear);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.CLIENTE), recargaController.obtenerPorId);

module.exports = router;
