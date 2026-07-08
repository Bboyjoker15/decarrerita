-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CLIENTE', 'CHOFER', 'ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "EstadoTraslado" AS ENUM ('PENDIENTE', 'COMPLETADO', 'CANCELADO', 'PAGADO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CLIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choferes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "numero_cuenta" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "choferes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_emergencia" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,

    CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pruebas_psicologicas" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "fecha_prueba" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pruebas_psicologicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revisiones_vehiculo" (
    "id" SERIAL NOT NULL,
    "vehiculo_id" INTEGER NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,
    "fecha_revision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revisiones_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recargas" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "referencia" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recargas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traslados" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "vehiculo_id" INTEGER NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "distancia_km" DOUBLE PRECISION NOT NULL,
    "tarifa_km" DOUBLE PRECISION NOT NULL,
    "monto_total" DOUBLE PRECISION NOT NULL,
    "ganancia_empresa" DOUBLE PRECISION NOT NULL,
    "ganancia_chofer" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoTraslado" NOT NULL DEFAULT 'PENDIENTE',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traslados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_chofer" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "administrativo_id" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "referencia" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_chofer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cedula_key" ON "users"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "users_correo_key" ON "users"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_nombre_key" ON "bancos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_codigo_key" ON "bancos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "choferes_user_id_key" ON "choferes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_user_id_key" ON "clientes"("user_id");

-- AddForeignKey
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pruebas_psicologicas" ADD CONSTRAINT "pruebas_psicologicas_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisiones_vehiculo" ADD CONSTRAINT "revisiones_vehiculo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargas" ADD CONSTRAINT "recargas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargas" ADD CONSTRAINT "recargas_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslados" ADD CONSTRAINT "traslados_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslados" ADD CONSTRAINT "traslados_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslados" ADD CONSTRAINT "traslados_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_chofer" ADD CONSTRAINT "pagos_chofer_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_chofer" ADD CONSTRAINT "pagos_chofer_administrativo_id_fkey" FOREIGN KEY ("administrativo_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
