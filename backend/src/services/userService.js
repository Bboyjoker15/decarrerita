const userRepository = require("../repositories/userRepository");

async function listar(filters = {}, pagination = {}) {
  const [data, total] = await Promise.all([
    userRepository.findAll(filters, pagination),
    userRepository.countAll(filters),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const user = await userRepository.findById(id);
  if (!user) return { error: "USUARIO.NO_ENCONTRADO" };
  return { data: user };
}

async function actualizar(id, data) {
  const user = await userRepository.findById(id);
  if (!user) return { error: "USUARIO.NO_ENCONTRADO" };
  const actualizado = await userRepository.update(id, data);
  return { data: actualizado };
}

async function eliminar(id) {
  const user = await userRepository.findById(id);
  if (!user) return { error: "USUARIO.NO_ENCONTRADO" };
  await userRepository.remove(id);
  return { data: null };
}

module.exports = { listar, obtenerPorId, actualizar, eliminar };
