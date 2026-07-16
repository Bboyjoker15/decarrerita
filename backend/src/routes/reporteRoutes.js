const { Router } = require("express");
const reporteController = require("../controllers/reporteController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/ganancias-empresa", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), reporteController.gananciasEmpresa);
router.get("/pagos-chofer/:id", authorize(ROLES.ADMIN, ROLES.ADMINISTRATIVO), reporteController.pagosChofer);

module.exports = router;