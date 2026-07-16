/*
  Warnings:

  - Added the required column `apellido` to the `contactos_emergencia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO');

-- AlterTable
ALTER TABLE "contactos_emergencia" ADD COLUMN     "apellido" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "traslados" ADD COLUMN     "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE';
