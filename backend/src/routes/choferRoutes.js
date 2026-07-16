const { Router } = require("express");
const choferController = require("../controllers/choferController");
const choferValidator = require("../validators/choferValidator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN), choferController.listar);

router.post(
  "/",
  authorize(ROLES.ADMIN),
  choferValidator.crear,
  validate,
  choferController.crear
);

router.get("/me", authorize(ROLES.CHOFER), choferController.miPerfil);
router.put("/me", authorize(ROLES.CHOFER), choferValidator.actualizar, validate, choferController.actualizarMiPerfil);

router.post("/me/contactos", authorize(ROLES.CHOFER), choferController.agregarMiContacto);
router.delete("/me/contactos/:contactoId", authorize(ROLES.CHOFER), choferController.eliminarMiContacto);

router.get("/:id", authorize(ROLES.ADMIN, ROLES.CHOFER), choferController.obtenerPorId);

router.put(
  "/:id",
  authorize(ROLES.ADMIN),
  choferValidator.actualizar,
  validate,
  choferController.actualizar
);

router.delete("/:id", authorize(ROLES.ADMIN), choferController.eliminar);

router.get("/:id/contactos", authorize(ROLES.ADMIN, ROLES.CHOFER), choferController.listarContactos);
router.post("/:id/contactos", authorize(ROLES.ADMIN), choferController.agregarContacto);
router.delete("/contactos/:id", authorize(ROLES.ADMIN), choferController.eliminarContacto);

module.exports = router;
