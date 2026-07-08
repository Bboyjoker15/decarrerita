const prisma = require("../config/database");

async function randomChoferActivo() {
  const choferes = await prisma.chofer.findMany({
    where: {
      vehiculos: {
        some: { activo: true },
      },
    },
    include: {
      user: true,
      vehiculos: {
        where: { activo: true },
      },
    },
  });

  if (choferes.length === 0) {
    return null;
  }

  const indice = Math.floor(Math.random() * choferes.length);
  return choferes[indice];
}

module.exports = { randomChoferActivo };
