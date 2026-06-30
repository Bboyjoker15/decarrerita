const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Limpiar datos existentes
  await prisma.pagoChofer.deleteMany();
  await prisma.traslado.deleteMany();
  await prisma.recarga.deleteMany();
  await prisma.revisionVehiculo.deleteMany();
  await prisma.pruebaPsicologica.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.contactoEmergencia.deleteMany();
  await prisma.chofer.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.banco.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  // Usuarios
  const admin = await prisma.user.create({
    data: {
      nombre: "Admin",
      apellido: "Sistema",
      cedula: "00000001",
      telefono: "04120000001",
      correo: "admin@decarrerita.com",
      password_hash: passwordHash,
      rol: "ADMIN",
    },
  });

  const clienteUser = await prisma.user.create({
    data: {
      nombre: "Carlos",
      apellido: "Mendoza",
      cedula: "12345678",
      telefono: "04121234567",
      correo: "cliente@decarrerita.com",
      password_hash: passwordHash,
      rol: "CLIENTE",
    },
  });

  const choferUser = await prisma.user.create({
    data: {
      nombre: "Pedro",
      apellido: "Ramirez",
      cedula: "87654321",
      telefono: "04129876543",
      correo: "chofer@decarrerita.com",
      password_hash: passwordHash,
      rol: "CHOFER",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      nombre: "Maria",
      apellido: "Garcia",
      cedula: "11223344",
      telefono: "04125556677",
      correo: "administrativo@decarrerita.com",
      password_hash: passwordHash,
      rol: "ADMINISTRATIVO",
    },
  });

  // Bancos
  const banco1 = await prisma.banco.create({
    data: { nombre: "Banco de Venezuela", codigo: "0102" },
  });
  const banco2 = await prisma.banco.create({
    data: { nombre: "Mercantil", codigo: "0105" },
  });
  const banco3 = await prisma.banco.create({
    data: { nombre: "Provincial", codigo: "0108" },
  });

  // Cliente
  const cliente = await prisma.cliente.create({
    data: {
      user_id: clienteUser.id,
      saldo: 150.0,
    },
  });

  // Chofer 1
  const chofer1 = await prisma.chofer.create({
    data: {
      user_id: choferUser.id,
      banco_id: banco1.id,
      numero_cuenta: "0102-123456-789",
      saldo: 0,
    },
  });

  // Contactos chofer 1
  await prisma.contactoEmergencia.createMany({
    data: [
      {
        chofer_id: chofer1.id,
        nombre: "Ana Ramirez",
        telefono: "04121111111",
        parentesco: "Esposa",
      },
      {
        chofer_id: chofer1.id,
        nombre: "Luis Ramirez",
        telefono: "04122222222",
        parentesco: "Hermano",
      },
    ],
  });

  // Vehiculo chofer 1
  const vehiculo1 = await prisma.vehiculo.create({
    data: {
      chofer_id: chofer1.id,
      marca: "Toyota",
      modelo: "Corolla",
      placa: "ABC123",
      anio: 2020,
      color: "Blanco",
      activo: true,
    },
  });

  // Prueba psicologica chofer 1
  await prisma.pruebaPsicologica.create({
    data: {
      chofer_id: chofer1.id,
      calificacion: 85,
    },
  });

  // Revision vehiculo 1
  await prisma.revisionVehiculo.create({
    data: {
      vehiculo_id: vehiculo1.id,
      calificacion: 78,
    },
  });

  // Chofer 2
  const chofer2User = await prisma.user.create({
    data: {
      nombre: "Jose",
      apellido: "Lopez",
      cedula: "99887766",
      telefono: "04128889900",
      correo: "jose.lopez@decarrerita.com",
      password_hash: passwordHash,
      rol: "CHOFER",
    },
  });

  const chofer2 = await prisma.chofer.create({
    data: {
      user_id: chofer2User.id,
      banco_id: banco2.id,
      numero_cuenta: "0105-987654-321",
      saldo: 0,
    },
  });

  await prisma.contactoEmergencia.createMany({
    data: [
      {
        chofer_id: chofer2.id,
        nombre: "Sofia Lopez",
        telefono: "04123333333",
        parentesco: "Madre",
      },
      {
        chofer_id: chofer2.id,
        nombre: "Pedro Lopez",
        telefono: "04124444444",
        parentesco: "Padre",
      },
    ],
  });

  const vehiculo2 = await prisma.vehiculo.create({
    data: {
      chofer_id: chofer2.id,
      marca: "Chevrolet",
      modelo: "Onix",
      placa: "DEF456",
      anio: 2021,
      color: "Rojo",
      activo: true,
    },
  });

  await prisma.pruebaPsicologica.create({
    data: {
      chofer_id: chofer2.id,
      calificacion: 90,
    },
  });

  await prisma.revisionVehiculo.create({
    data: {
      vehiculo_id: vehiculo2.id,
      calificacion: 82,
    },
  });

  console.log("Seed ejecutado exitosamente");
  console.log("Credenciales de prueba (password: 123456):");
  console.log("  admin@decarrerita.com (ADMIN)");
  console.log("  cliente@decarrerita.com (CLIENTE)");
  console.log("  chofer@decarrerita.com (CHOFER)");
  console.log("  administrativo@decarrerita.com (ADMINISTRATIVO)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
