const { Router } = require("express");
const pagoController = require("../controllers/pagoController");
const pagoValidator = require("../validators/pagoValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), pagoController.listar);
router.post("/", authorize(ROLES.ADMINISTRATIVO), pagoValidator.crear, validate, pagoController.crear);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), pagoController.obtenerPorId);

module.exports = router;
