-- DropForeignKey
ALTER TABLE "choferes" DROP CONSTRAINT "choferes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contactos_emergencia" DROP CONSTRAINT "contactos_emergencia_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "pruebas_psicologicas" DROP CONSTRAINT "pruebas_psicologicas_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "revisiones_vehiculo" DROP CONSTRAINT "revisiones_vehiculo_vehiculo_id_fkey";

-- DropForeignKey
ALTER TABLE "vehiculos" DROP CONSTRAINT "vehiculos_chofer_id_fkey";

-- AddForeignKey
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pruebas_psicologicas" ADD CONSTRAINT "pruebas_psicologicas_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisiones_vehiculo" ADD CONSTRAINT "revisiones_vehiculo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
