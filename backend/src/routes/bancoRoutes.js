const { Router } = require("express");
const bancoController = require("../controllers/bancoController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", bancoController.listar);
router.post("/", bancoController.crear);
router.put("/:id", bancoController.actualizar);
router.delete("/:id", bancoController.eliminar);

module.exports = router;
