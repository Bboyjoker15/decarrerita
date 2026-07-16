const prisma = require("../config/database");

const NOTA_MINIMA_PRUEBA = 73;
const NOTA_MINIMA_REVISION = 65;
const DIAS_VIGENCIA = 365;

async function randomChoferActivo() {
  const fechaLimite = new Date(Date.now() - DIAS_VIGENCIA * 24 * 60 * 60 * 1000);

  const choferes = await prisma.chofer.findMany({
    where: {
      pruebas: {
        some: {
          calificacion: { gte: NOTA_MINIMA_PRUEBA },
          fecha_prueba: { gte: fechaLimite },
        },
      },
      vehiculos: {
        some: {
          activo: true,
          revisiones: {
            some: {
              calificacion: { gte: NOTA_MINIMA_REVISION },
              fecha_revision: { gte: fechaLimite },
            },
          },
        },
      },
    },
    include: {
      user: true,
      vehiculos: {
        where: {
          activo: true,
          revisiones: {
            some: {
              calificacion: { gte: NOTA_MINIMA_REVISION },
              fecha_revision: { gte: fechaLimite },
            },
          },
        },
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
