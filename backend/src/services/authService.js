const userRepository = require("../repositories/userRepository");
const clienteRepository = require("../repositories/clienteRepository");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

async function register({ nombre, apellido, cedula, telefono, correo, password, rol }) {
  const correoExistente = await userRepository.findByCorreo(correo);
  if (correoExistente) {
    return { error: "AUTH.EMAIL_DUPLICADO" };
  }

  const cedulaExistente = await userRepository.findByCedula(cedula);
  if (cedulaExistente) {
    return { error: "AUTH.CEDULA_DUPLICADA" };
  }

  const password_hash = await hashPassword(password);

  const user = await userRepository.create({
    nombre, apellido, cedula, telefono, correo, password_hash, rol,
  });

  if (rol === "CLIENTE") {
    await clienteRepository.create({ user_id: user.id, saldo: 0 });
  }

  const token = generateToken({ id: user.id, correo: user.correo, rol: user.rol });

  return {
    data: {
      token,
      user: { id: user.id, nombre, apellido, correo, rol },
    },
  };
}

async function login({ correo, password }) {
  const user = await userRepository.findByCorreo(correo);
  if (!user) {
    return { error: "AUTH.CREDENCIALES_INVALIDAS" };
  }

  const passwordValida = await comparePassword(password, user.password_hash);
  if (!passwordValida) {
    return { error: "AUTH.CREDENCIALES_INVALIDAS" };
  }

  const token = generateToken({ id: user.id, correo: user.correo, rol: user.rol });

  return {
    data: {
      token,
      user: { id: user.id, nombre: user.nombre, apellido: user.apellido, correo: user.correo, rol: user.rol },
    },
  };
}

module.exports = { register, login };
