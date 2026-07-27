# Manual Operativo y Guía Técnica del Sistema: Decarrerita (Cross-Roads)

---

# 1. Guía de Setup y Despliegue en Entorno Local

> **[Seguro]**
>
> Para inicializar la plataforma desde cero en tu máquina de desarrollo, sigue este procedimiento paso a paso.

## Requisitos Previos

- Node.js: Versión LTS 18.x o superior.
- Supabase CLI: Instalado en el sistema para administrar PostgreSQL localmente.
- Git: Para el control de versiones.

---

## Paso 1: Configuración de Variables de Entorno en el Backend

Abre el archivo `backend/.env` y verifica que apunte a la instancia local de Supabase CLI (puerto **54322**):

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
JWT_SECRET="clave_secreta_decarrerita_2026"
JWT_EXPIRES_IN="24h"
```

---

## Paso 2: Inicialización del Motor de Base de Datos

Abre una terminal en la raíz del proyecto y arranca los servicios de Supabase:

```bash
supabase start
```

Navega a la carpeta del servidor y aplica la estructura del esquema con su semilla de datos:

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
```

---

## Paso 3: Puesta en Marcha de los Servidores

### Servidor Backend (API Express)

```bash
# Dentro de la carpeta backend/
npm run dev
```

**Escuchando en:** `http://localhost:4000`

---

### Servidor Frontend (React + Vite)

```bash
# En una nueva terminal, dentro de la carpeta frontend/
npm install
npm run dev
```

**Escuchando en:** `http://localhost:3000`

---

# 2. Diccionario Conceptual de la Arquitectura

> **[Seguro]**
>
> Esta sección desglosa las bases del sistema utilizando el patrón:
>
> **Concepto → ¿Qué es? → ¿Qué hace? → ¿Por qué? → ¿Para qué?**

---

## Concepto 1: Ecosistema Decarrerita (Cross-Roads)

### ¿Qué es?

Una plataforma web centralizada para la gestión de transporte de pasajeros mediante flota liviana urbana.

### ¿Qué hace?

Procesa solicitudes de viajes, asigna choferes de forma aleatoria, administra saldos de usuarios y liquida pagos a conductores.

### ¿Por qué?

Porque la empresa requiere automatizar el control contable de comisiones y auditar la aptitud de choferes y vehículos.

### ¿Para qué?

Para ofrecer un servicio eficiente y transparente donde los clientes reservan traslados y la empresa retiene una comisión fija por cada carrera realizada.

---

## Concepto 2: Tarifa Fija Unificada ($10.00 USD)

### ¿Qué es?

La regla de negocio de cobro único establecida por el equipo para la plataforma.

### ¿Qué hace?

Fija el costo de cualquier traslado dentro de la ciudad en **$10.00 USD**.

### ¿Por qué?

Porque el enunciado otorga discreción al equipo para definir el algoritmo de cálculo de costos sin complicar el esquema relacional con métricas complejas.

### ¿Para qué?

Para simplificar la experiencia del cliente, garantizar previsibilidad en el cobro y eliminar columnas redundantes (`distancia_km`, `tarifa_km`) del modelo de base de datos.

---

## Concepto 3: División Contable de Ingresos (30% / 70%)

### ¿Qué es?

El algoritmo de distribución financiera por cada carrera efectuada.

### ¿Qué hace?

Divide automáticamente los **$10.00 USD** cobrados al cliente, asignando:

- **$3.00 USD (30%)** como ganancia bruta para la empresa.
- **$7.00 USD (70%)** como saldo neto a favor del chofer.

### ¿Por qué?

Porque la especificación del proyecto establece que Decarrerita se queda con el **30%** del valor del viaje.

### ¿Para qué?

Para acumular de forma transparente las cuentas por pagar a los conductores y auditar los ingresos corporativos.

---

## Concepto 4: Control de Aptitud Anual

### ¿Qué es?

El filtro de validación de calidad y seguridad para choferes y vehículos.

### ¿Qué hace?

Registra una evaluación psicológica a los choferes (**nota mínima aprobatoria de 73/100**) y una revisión mecánica a los vehículos (**nota mínima de 65/100**).

### ¿Por qué?

Porque los vehículos no son propiedad de la empresa y se requiere garantizar el cumplimiento de estándares mínimos de seguridad.

### ¿Para qué?

Para restringir la asignación de traslados únicamente a conductores y unidades certificadas por el personal administrativo.

---

## Concepto 5: Estado de Liquidación (PENDIENTE vs PAGADO/CANCELADO)

### ¿Qué es?

El indicador del flujo contable entre la empresa Decarrerita y el chofer.

### ¿Qué hace?

Rastrea si el **70%** acumulado de un viaje ya fue transferido al banco personal del chofer o si permanece en la billetera virtual de la empresa.

### ¿Por qué?

Porque el término **"cancelar"** en el informe administrativo refiere a pagar o liquidar una deuda.

### ¿Para qué?

Para dar cumplimiento a la generación de reportes de traslados pendientes por cancelar e historial de pagos ejecutados por administración.

---

# 3. Desglose Operativo por Roles, Formularios y Ubicación de Opciones

---

# Rol 1: Usuario Cliente

> **[Seguro]**

### Credenciales de prueba

- **Correo:** cliente@decarrerita.com
- **Clave:** 123456

---

## 1. Formulario de Recarga de Saldo

### Ubicación en UI

Dashboard Cliente → Tarjeta Superior **"Billetera Virtual"** → Botón **"Recargar Saldo"**

### Campos del Formulario

- Banco Origen (Selector desplegable con los bancos registrados).
- Número de Referencia (Input de texto obligatorio).
- Fecha de Transferencia (Input tipo date obligatorio).
- Monto a Recargar (Input numérico en USD).

### Acción Backend

Registra la recarga en la tabla **recargas** e incrementa inmediatamente el saldo del cliente.

---

## 2. Formulario de Solicitud de Traslado

### Ubicación en UI

Dashboard Cliente → Sección Principal **"Solicitar Nuevo Traslado"**

### Campos del Formulario

- Dirección / Punto A de Origen (Input de texto).
- Dirección / Punto B de Destino (Input de texto).

### Mecanismo de Procesamiento

- Valida que el cliente tenga un saldo mayor o igual a **$10.00 USD**.
- Selecciona un chofer activo de forma aleatoria.
- Descuenta **$10.00 USD** del saldo del cliente.
- Acredita **$7.00 USD** al saldo a favor del chofer.
- Renderiza en pantalla la ficha con los datos del chofer asignado y la placa/modelo de su vehículo.

---

## 3. Tablas y Consultas Visibles

### Historial de Recargas

Muestra fecha, banco, referencia y monto abonado.

### Bitácora de Viajes

Lista de traslados realizados con origen, destino, chofer asignado y costo (**$10.00 USD**).

---

# Rol 2: Usuario Chofer

> **[Seguro]**

### Credenciales de prueba

- **Correo:** chofer@decarrerita.com
- **Clave:** 123456

---

## 1. Formulario de Perfil Financiero y Contactos

### Ubicación en UI

Dashboard Chofer → Pestaña **"Mi Perfil"**

### Campos del Formulario

- Entidad Bancaria Personal (Selector).
- Número de Cuenta Bancaria (Input de texto).
- Contactos de Emergencia (Sección dinámica que exige registrar al menos dos (2) contactos con nombre, relación y teléfono).

---

## 2. Formulario de Registro de Vehículo

### Ubicación en UI

Dashboard Chofer → Pestaña **"Mi Flota"** → **"Registrar Vehículo"**

### Campos del Formulario

- Marca y Modelo (Ej: Toyota Corolla).
- Placa / Patente (Input de texto único).
- Año y Color (Inputs numérico y de texto).

### Regla de Negocio

Un chofer puede tener múltiples vehículos vinculados a su cuenta.

---

## 3. Tablas y Consultas Visibles

### Indicadores Financieros

Saldo Neto A Favor (**$7.00 USD** acumulados por cada carrera asignada).

### Bitácora de Traslados Asignados

Muestra la fecha, el origen/destino del cliente y el estado del pago (**PENDIENTE** o **PAGADO**).

---

# Rol 3: Personal Administrativo

> **[Seguro]**

### Credenciales de prueba

- **Correo:** administrativo@decarrerita.com
- **Clave:** 123456

---

## 1. Formulario de Evaluaciones de Aptitud Anual

### Ubicación en UI

Panel Admin → Pestaña **"Control de Aptitud"**

---

### Sub-Formulario A (Prueba Psicológica Chofer)

#### Campos

- Selector de Chofer.
- Calificación (0 a 100, aprobatoria >= 73).
- Fecha de aplicación.

---

### Sub-Formulario B (Revisión Mecánica Vehículo)

#### Campos

- Selector de Vehículo.
- Calificación (0 a 100, apto >= 65).
- Fecha de revisión.

---

## 2. Formulario de Liquidación de Pagos a Choferes

### Ubicación en UI

Panel Admin → Pestaña **"Módulo de Liquidación"**

### Campos del Formulario

- Selección de Traslado Pendiente (Selector desplegable que muestra traslados con `estado_pago = PENDIENTE`).
- Entidad Bancaria de Origen (Selector).
- Número de Referencia del Pago (Input de texto).
- Monto Transferido (Input numérico correspondiente al 70% del chofer).
- Fecha de Liquidación (Input tipo date).

### Acción Backend

Crea un registro en la tabla **pagos_chofer** y cambia el **estado_pago** del traslado a **PAGADO / CANCELADO**.

---

## 3. Tablas y Consultas Visibles

### Reporte de Recaudación Empresa

Filtro por período de tiempo que suma las comisiones del **30% ($3.00 USD por traslado)**.

### Reporte de Pagos por Chofer

Historial filtrable por chofer específico y rango de fechas.

---

# Rol 4: Administrador Global

> **[Seguro]**

### Credenciales de prueba

- **Correo:** admin@decarrerita.com
- **Clave:** 123456

---

## Vistas y Filtros del Sistema

### Ubicación en UI

Panel Administrador → Pestaña **"Auditoría Global"**

### Funcionalidades de Consulta

- Filtro de Traslados por Período: Selector de fecha inicio y fecha fin.
- Listado de Traslados Pagados/Cancelados: Visualización exclusiva de carreras liquidadas al chofer.
- Listado de Traslados Pendientes: Visualización de cuentas por pagar vigentes.

---

# 4. Administración Visual de Base de Datos

> **[Seguro]**
>
> Para auditar las 12 tablas relacionales directamente sin usar la consola interactiva:

---

## Prisma Studio (Cliente del ORM)

### Comando terminal

```bash
npx prisma studio
```

*(en `backend/`)*

### Dirección web

```
http://localhost:5555
```

---

## Supabase Studio Local (Dashboard Oficial)

### Comando terminal

```bash
supabase start
```

### Dirección web

```
http://localhost:54323
```

**Sección:** Table Editor.