const bancoRepository = require("../repositories/bancoRepository");

async function listar() {
  return bancoRepository.findAll();
}

async function obtenerPorId(id) {
  const banco = await bancoRepository.findById(id);
  if (!banco) return { error: "BANCO.NO_ENCONTRADO" };
  return { data: banco };
}

async function crear(data) {
  const creado = await bancoRepository.create(data);
  return { data: creado };
}

async function actualizar(id, data) {
  const banco = await bancoRepository.findById(id);
  if (!banco) return { error: "BANCO.NO_ENCONTRADO" };
  const actualizado = await bancoRepository.update(id, data);
  return { data: actualizado };
}

async function eliminar(id) {
  const banco = await bancoRepository.findById(id);
  if (!banco) return { error: "BANCO.NO_ENCONTRADO" };
  await bancoRepository.remove(id);
  return { data: null };
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
