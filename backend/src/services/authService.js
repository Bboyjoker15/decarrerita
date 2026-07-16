const prisma = require("../config/database");
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

/**
 * Registro autonomo de choferes con transaccion atomica.
 * Crea User + Chofer (saldo 0) + ContactosEmergencia en una sola operacion.
 */
async function registerChofer({ nombre, apellido, cedula, telefono, correo, password, banco_id, numero_cuenta, contactos }) {
  const correoExistente = await userRepository.findByCorreo(correo);
  if (correoExistente) return { error: "AUTH.EMAIL_DUPLICADO" };

  const cedulaExistente = await userRepository.findByCedula(cedula);
  if (cedulaExistente) return { error: "AUTH.CEDULA_DUPLICADA" };

  const password_hash = await hashPassword(password);

  // Transaccion nativa de Prisma: registro completo en una operacion atomica
  const resultado = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { nombre, apellido, cedula, telefono, correo, password_hash, rol: "CHOFER" },
    });

    const chofer = await tx.chofer.create({
      data: { user_id: user.id, banco_id, numero_cuenta, saldo: 0 },
    });

    for (const contacto of contactos) {
      await tx.contactoEmergencia.create({
        data: {
          chofer_id: chofer.id,
          nombre: contacto.nombre,
          apellido: contacto.apellido,
          telefono: contacto.telefono,
          parentesco: contacto.parentesco,
        },
      });
    }

    return { user, chofer };
  });

  const token = generateToken({ id: resultado.user.id, correo: resultado.user.correo, rol: resultado.user.rol });

  return {
    data: {
      token,
      user: { id: resultado.user.id, nombre, apellido, correo, rol: resultado.user.rol },
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

module.exports = { register, registerChofer, login };
