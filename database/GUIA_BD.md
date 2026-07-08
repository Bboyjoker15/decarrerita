# Guía de Base de Datos — Decarrerita

## 📋 Introducción

**Decarrerita** es una plataforma de transporte universitario. Este documento contiene:
- El schema SQL oficial para crear la base de datos
- Instrucciones para configurar Supabase (Online o Local)
- Reglas de colaboración para mantener la BD sincronizada

## 📁 Estructura del proyecto

```
decarrerita/
├── backend/        # Node.js + Express + Prisma (API)
│   └── prisma/
│       └── schema.prisma   # Schema de Prisma (fuente de verdad del backend)
├── database/       # Scripts SQL y config de BD
│   ├── GUIA_BD.md          # Este archivo
│   ├── migrations/         # Migraciones SQL versionadas
│   └── supabase/           # Config para Supabase Local
├── docs/           # Documentación general
└── frontend/       # React + Vite + Tailwind
```

> **Importante**: Hay **dos fuentes de verdad** que deben mantenerse sincronizadas:
> 1. `backend/prisma/schema.prisma` — para el backend (Node.js)
> 2. `database/migrations/` — scripts SQL versionados para compartir con el equipo

---

## 🗄️ Schema SQL Completo

Ejecuta esto en el **SQL Editor** de Supabase (o en tu cliente PostgreSQL).

### 1. Enums

```sql
CREATE TYPE rol AS ENUM ('ADMIN', 'CLIENTE', 'CHOFER', 'ADMINISTRATIVO');
CREATE TYPE estado_traslado AS ENUM ('SOLICITADO', 'ACEPTADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO');
CREATE TYPE estado_conductor AS ENUM ('EN_REVISION', 'ACTIVO', 'INACTIVO', 'SUSPENDIDO');
CREATE TYPE estado_vehiculo AS ENUM ('ACTIVO', 'EN_MANTENIMIENTO', 'INACTIVO');
CREATE TYPE estado_recarga AS ENUM ('PENDIENTE', 'COMPLETADA', 'RECHAZADA');
```

### 2. Tablas

```sql
-- ============================================================
-- CONFIGURACIONES DEL SISTEMA
-- ============================================================
CREATE TABLE configuraciones (
  id                SERIAL PRIMARY KEY,
  clave             VARCHAR NOT NULL UNIQUE,
  valor             NUMERIC NOT NULL,
  descripcion       TEXT,
  fecha_actualizacion TIMESTAMPTZ DEFAULT now()
);

-- Insertar valores por defecto
INSERT INTO configuraciones (clave, valor, descripcion) VALUES
  ('tarifa_base', 2.50, 'Tarifa base por viaje en USD'),
  ('tarifa_km', 0.75, 'Tarifa por kilómetro recorrido en USD'),
  ('porcentaje_empresa', 0.30, 'Porcentaje que retiene la empresa (30%)'),
  ('porcentaje_conductor', 0.70, 'Porcentaje que gana el conductor (70%)');

-- ============================================================
-- PERFILES (vinculados a auth.users de Supabase)
-- ============================================================
CREATE TABLE perfiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombres           VARCHAR NOT NULL,
  apellidos         VARCHAR NOT NULL,
  cedula            VARCHAR NOT NULL UNIQUE,
  telefono          VARCHAR NOT NULL,
  direccion         TEXT,
  fecha_nacimiento  DATE,
  rol               ROL NOT NULL DEFAULT 'CLIENTE',
  activo            BOOLEAN DEFAULT true,
  creado_en         TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BANCOS
-- ============================================================
CREATE TABLE bancos (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL UNIQUE,
  codigo VARCHAR NOT NULL UNIQUE
);

-- ============================================================
-- CONDUCTORES
-- ============================================================
CREATE TABLE conductores (
  id                UUID PRIMARY KEY REFERENCES perfiles(id) ON DELETE CASCADE,
  banco_id          INTEGER NOT NULL REFERENCES bancos(id),
  numero_cuenta     VARCHAR NOT NULL,
  saldo_actual      NUMERIC DEFAULT 0 CHECK (saldo_actual >= 0),
  fecha_registro    TIMESTAMPTZ DEFAULT now(),
  estado            ESTADO_CONDUCTOR DEFAULT 'EN_REVISION'
);

-- ============================================================
-- CONTACTOS DE EMERGENCIA
-- ============================================================
CREATE TABLE contactos_emergencia (
  id            SERIAL PRIMARY KEY,
  conductor_id  UUID NOT NULL REFERENCES conductores(id) ON DELETE CASCADE,
  nombres       VARCHAR NOT NULL,
  telefono      VARCHAR NOT NULL,
  parentesco    VARCHAR NOT NULL
);

-- ============================================================
-- VEHÍCULOS
-- ============================================================
CREATE TABLE vehiculos (
  id            SERIAL PRIMARY KEY,
  conductor_id  UUID NOT NULL REFERENCES conductores(id) ON DELETE CASCADE,
  placa         VARCHAR NOT NULL UNIQUE,
  marca         VARCHAR NOT NULL,
  modelo        VARCHAR NOT NULL,
  anio          INTEGER NOT NULL,
  color         VARCHAR,
  capacidad     INTEGER DEFAULT 4,
  estado        ESTADO_VEHICULO DEFAULT 'ACTIVO'
);

-- ============================================================
-- EVALUACIONES PSICOLÓGICAS
-- ============================================================
CREATE TABLE evaluaciones_psicologicas (
  id                SERIAL PRIMARY KEY,
  conductor_id      UUID NOT NULL REFERENCES conductores(id) ON DELETE CASCADE,
  personal_admin_id UUID NOT NULL REFERENCES perfiles(id),
  nota              NUMERIC NOT NULL CHECK (nota >= 73 AND nota <= 100),
  fecha_evaluacion  DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE NOT NULL,
  observaciones     TEXT,
  CONSTRAINT nota_minima_psicologica CHECK (nota >= 73)
);

-- ============================================================
-- REVISIONES VEHICULARES
-- ============================================================
CREATE TABLE revisiones_vehiculares (
  id                SERIAL PRIMARY KEY,
  vehiculo_id       INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
  personal_admin_id UUID NOT NULL REFERENCES perfiles(id),
  nota              NUMERIC NOT NULL CHECK (nota >= 65 AND nota <= 100),
  fecha_revision    DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE NOT NULL,
  observaciones     TEXT
);

-- ============================================================
-- CLIENTES
-- ============================================================
CREATE TABLE clientes (
  id              UUID PRIMARY KEY REFERENCES perfiles(id) ON DELETE CASCADE,
  saldo_actual    NUMERIC DEFAULT 0 CHECK (saldo_actual >= 0),
  fecha_registro  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RECARGAS DE SALDO
-- ============================================================
CREATE TABLE recargas_saldo (
  id                SERIAL PRIMARY KEY,
  cliente_id        UUID NOT NULL REFERENCES clientes(id),
  monto             NUMERIC NOT NULL CHECK (monto > 0),
  fecha_recarga     TIMESTAMPTZ DEFAULT now(),
  numero_referencia VARCHAR NOT NULL,
  banco_id          INTEGER NOT NULL REFERENCES bancos(id),
  estado            ESTADO_RECARGA DEFAULT 'COMPLETADA'
);

-- ============================================================
-- TRASLADOS
-- ============================================================
CREATE TABLE traslados (
  id                    SERIAL PRIMARY KEY,
  cliente_id            UUID NOT NULL REFERENCES clientes(id),
  conductor_id          UUID NOT NULL REFERENCES conductores(id),
  vehiculo_id           INTEGER NOT NULL REFERENCES vehiculos(id),
  punto_a               VARCHAR NOT NULL,
  punto_b               VARCHAR NOT NULL,
  distancia_km          NUMERIC NOT NULL,
  tarifa_base_aplicada  NUMERIC NOT NULL,
  tarifa_km_aplicada    NUMERIC NOT NULL,
  costo_total           NUMERIC NOT NULL,
  ganancia_empresa      NUMERIC NOT NULL,
  ganancia_conductor    NUMERIC NOT NULL,
  estado                ESTADO_TRASLADO DEFAULT 'SOLICITADO',
  fecha_solicitud       TIMESTAMPTZ DEFAULT now(),
  fecha_completado      TIMESTAMPTZ,
  CONSTRAINT chk_fechas CHECK (
    fecha_completado IS NULL OR fecha_completado >= fecha_solicitud
  )
);

-- ============================================================
-- PAGOS A CONDUCTORES
-- ============================================================
CREATE TABLE pagos_conductores (
  id                SERIAL PRIMARY KEY,
  conductor_id      UUID NOT NULL REFERENCES conductores(id),
  personal_admin_id UUID NOT NULL REFERENCES perfiles(id),
  monto_total       NUMERIC NOT NULL CHECK (monto_total > 0),
  fecha_pago        DATE NOT NULL DEFAULT CURRENT_DATE,
  numero_referencia VARCHAR NOT NULL UNIQUE,
  observaciones     TEXT
);

-- ============================================================
-- RELACIÓN TRASLADOS ↔ PAGOS (M:N)
-- ============================================================
CREATE TABLE traslados_pagos (
  id                  SERIAL PRIMARY KEY,
  traslado_id         INTEGER NOT NULL UNIQUE REFERENCES traslados(id),
  pago_conductor_id   INTEGER NOT NULL REFERENCES pagos_conductores(id) ON DELETE CASCADE
);
```

### 3. Índices recomendados (después de insertar datos)

```sql
CREATE INDEX idx_conductores_estado ON conductores(estado);
CREATE INDEX idx_vehiculos_conductor ON vehiculos(conductor_id);
CREATE INDEX idx_traslados_cliente ON traslados(cliente_id);
CREATE INDEX idx_traslados_conductor ON traslados(conductor_id);
CREATE INDEX idx_traslados_fecha ON traslados(fecha_solicitud);
CREATE INDEX idx_traslados_estado ON traslados(estado);
CREATE INDEX idx_recargas_cliente ON recargas_saldo(cliente_id);
CREATE INDEX idx_pagos_conductor ON pagos_conductores(conductor_id);
```

---

## ☁️ Supabase Online — Configuración

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Crea un **New Project**:
   - Name: `decarrerita`
   - Database Password: (guárdala)
   - Region: la más cercana
3. Espera a que termine el provisioning (~2 min)
4. Ve a **SQL Editor** → pega todo el script de arriba → **Run**
5. Ve a **Project Settings → API**:
   - Copia **Project URL** → `VITE_SUPABASE_URL` en frontend
   - Copia **anon public key** → `VITE_SUPABASE_ANON_KEY` en frontend
   - Copia **service_role key** (para backend) → `SUPABASE_SERVICE_KEY` en backend

### Backend `.env`

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_KEY=[service_role_key]
JWT_SECRET=...  # Opcional si usas solo Supabase Auth
PORT=4000
```

---

## 🤝 Reglas de colaboración

### Todos tenemos la misma BD

```
Cada quien elige dónde ejecuta su base de datos:
┌─────────────────────────────────────────────────────────────┐
│  Supabase Online  │  Supabase Local  │  PostgreSQL manual  │
│  (sin Docker)      │  (con Docker)    │  (pgAdmin, etc.)    │
└─────────────────────────────────────────────────────────────┘
         │                      │                      │
         └──────────────┬───────┘                      │
                        │                              │
              Todos ejecutan el MISMO schema SQL
```

### Flujo de trabajo

1. **La encargada de BD** diseña los cambios y los prueba en su Supabase
2. **Commitea** los scripts SQL modificados en `database/migrations/`
3. **El equipo** hace `git pull` y ejecuta los nuevos scripts en sus BDs locales/online
4. **Backend** se actualiza via Prisma: `npx prisma db pull` (o migración manual)

### Estructura de migraciones

```
database/migrations/
├── 001_initial_schema.sql
├── 002_add_tarifas_table.sql
└── 003_add_campo_observaciones.sql
```

Cada migración debe tener:
- Fecha y autor en comentario SQL
- Solo los cambios incrementales (ALTER TABLE, CREATE, etc.)
- Instrucciones de rollback comentadas

### Ejemplo de migración

```sql
-- migrations/002_add_tarifas_table.sql
-- Fecha: 2026-07-08
-- Autor: Maria (encargada BD)
-- Descripcion: Agregar tabla de tarifas historicas

CREATE TABLE tarifas_historicas (
  id          SERIAL PRIMARY KEY,
  tarifa_km   NUMERIC NOT NULL,
  vigencia    DATE NOT NULL DEFAULT CURRENT_DATE,
  creado_por  UUID REFERENCES perfiles(id)
);

-- Rollback:
-- DROP TABLE IF EXISTS tarifas_historicas;
```

---

## 🔗 Mapeo Backend ↔ Base de Datos

| Tabla SQL | Modelo Prisma | API Endpoint |
|---|---|---|
| `perfiles` | `User` → `Perfil` (próximamente) | `/api/users` |
| `bancos` | `Banco` | `/api/bancos` |
| `conductores` | `Chofer` | `/api/choferes` |
| `contactos_emergencia` | `ContactoEmergencia` | `/api/choferes/:id/contactos` |
| `vehiculos` | `Vehiculo` | `/api/vehiculos` |
| `evaluaciones_psicologicas` | `PruebaPsicologica` | `/api/pruebas-psicologicas` |
| `revisiones_vehiculares` | `RevisionVehiculo` | `/api/revisiones-vehiculo` |
| `clientes` | `Cliente` | `/api/clientes` |
| `recargas_saldo` | `Recarga` | `/api/recargas` |
| `traslados` | `Traslado` | `/api/traslados` |
| `pagos_conductores` | `PagoChofer` | `/api/pagos` |
| `traslados_pagos` | *(pendiente)* | *(pendiente)* |
| `configuraciones` | *(pendiente)* | *(pendiente)* |

---

## ❓ Preguntas frecuentes

**¿Puedo usar Supabase Online y otra persona Local?**
Sí. Mientras ejecuten el mismo schema SQL, no hay problema. Cada quien configura su `DATABASE_URL` en `.env`.

**¿Cómo sé si mi BD está actualizada?**
Revisa `database/migrations/` en GitHub. Si hay un archivo que no has ejecutado, ejecútalo.

**¿Qué hago si un cambio de schema rompe el backend?**
La encargada de BD debe coordinar con el equipo de backend. Los cambios mayores se planean en conjunto.

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- Schema de referencia: `backend/prisma/schema.prisma`
- Bitácora del proyecto: `docs/BITACORA.txt`
