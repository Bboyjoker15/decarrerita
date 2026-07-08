const choferRepository = require("../repositories/choferRepository");
const userRepository = require("../repositories/userRepository");
const { hashPassword } = require("../utils/password");

async function listar() {
  return choferRepository.findAll();
}

async function obtenerPorId(id) {
  const chofer = await choferRepository.findById(id);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  return { data: chofer };
}

async function obtenerPorUserId(userId) {
  const chofer = await choferRepository.findByUserId(userId);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  return { data: chofer };
}

async function crear({ nombre, apellido, cedula, telefono, correo, password, banco_id, numero_cuenta, contactos }) {
  const correoExistente = await userRepository.findByCorreo(correo);
  if (correoExistente) return { error: "AUTH.EMAIL_DUPLICADO" };

  const cedulaExistente = await userRepository.findByCedula(cedula);
  if (cedulaExistente) return { error: "AUTH.CEDULA_DUPLICADA" };

  const password_hash = await hashPassword(password);

  const user = await userRepository.create({
    nombre, apellido, cedula, telefono, correo, password_hash, rol: "CHOFER",
  });

  const chofer = await choferRepository.create({
    user_id: user.id, banco_id, numero_cuenta, saldo: 0,
  });

  if (contactos && contactos.length >= 2) {
    for (const contacto of contactos) {
      await choferRepository.createContacto({ chofer_id: chofer.id, ...contacto });
    }
  }

  return { data: await choferRepository.findById(chofer.id) };
}

async function actualizar(id, data) {
  const chofer = await choferRepository.findById(id);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  const actualizado = await choferRepository.update(id, data);
  return { data: actualizado };
}

async function eliminar(id) {
  const chofer = await choferRepository.findById(id);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  await choferRepository.remove(id);
  return { data: null };
}

async function listarContactos(choferId) {
  const chofer = await choferRepository.findById(choferId);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  return choferRepository.findContactosByChoferId(choferId);
}

async function agregarContacto(choferId, data) {
  const chofer = await choferRepository.findById(choferId);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };
  const contacto = await choferRepository.createContacto({ chofer_id: choferId, ...data });
  return { data: contacto };
}

async function eliminarContacto(contactoId) {
  await choferRepository.deleteContacto(contactoId);
  return { data: null };
}

module.exports = { listar, obtenerPorId, obtenerPorUserId, crear, actualizar, eliminar, listarContactos, agregarContacto, eliminarContacto };
