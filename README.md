# Decarrerita 🚗

Plataforma de transporte urbano desarrollada como proyecto universitario. Sistema similar a Uber con gestión completa de clientes, choferes, vehículos, recargas de saldo y pagos.

## Tecnologías

### Frontend
- **React 18** + **Vite** — UI moderna y rápida
- **React Router v6** — Navegación SPA
- **Axios** — Cliente HTTP
- **TailwindCSS** — Estilos utilitarios

### Backend
- **Node.js** + **Express** — API REST
- **Prisma ORM** — Mapeo de base de datos
- **JWT** — Autenticación por tokens
- **bcrypt** — Hash de contraseñas

### Base de Datos
- **PostgreSQL 16** — Base de datos relacional
- **Supabase Local** — Desarrollo local

### DevOps
- **Docker** — Contenedor de base de datos
- **Git** + **GitHub** — Control de versiones

## Estructura del Proyecto

```
decarrerita/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── components/   # Componentes reutilizables
│   │   ├── layouts/      # Layouts por rol
│   │   ├── routes/       # Configuración de rutas
│   │   ├── services/     # Servicios HTTP (Axios)
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # Contextos (Auth)
│   │   ├── utils/        # Utilidades
│   │   └── assets/       # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # API REST Express
│   ├── prisma/
│   │   ├── schema.prisma  # Modelo de datos
│   │   └── seed.js        # Datos de prueba
│   ├── src/
│   │   ├── config/        # Configuración (DB, env)
│   │   ├── controllers/   # Controladores MVC
│   │   ├── routes/        # Definición de rutas
│   │   ├── middlewares/    # Auth, roles, errores
│   │   ├── services/      # Lógica de negocio
│   │   ├── repositories/  # Acceso a datos
│   │   ├── validators/    # Validación de entrada
│   │   ├── utils/         # Utilidades (JWT, bcrypt)
│   │   └── constants/     # Constantes del sistema
│   ├── package.json
│   └── .env.example
│
├── database/          # Configuración Supabase
│   └── supabase/
│       └── config.toml
│
├── docs/              # Documentación
├── docker-compose.yml # Base de datos PostgreSQL
├── .gitignore
└── README.md
```

## Requisitos Previos

- Node.js >= 18
- Docker Desktop
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/decarrerita.git
cd decarrerita
```

### 2. Base de datos (PostgreSQL con Docker)

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env` si es necesario:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/decarrerita?schema=public"
JWT_SECRET="clave-segura-aqui"
JWT_EXPIRES_IN="24h"
PORT=4000
```

Ejecutar migraciones y seed:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Iniciar servidor:

```bash
npm run dev
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Credenciales de Prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| ADMIN | admin@decarrerita.com | 123456 |
| CLIENTE | cliente@decarrerita.com | 123456 |
| CHOFER | chofer@decarrerita.com | 123456 |
| ADMINISTRATIVO | administrativo@decarrerita.com | 123456 |

## Scripts Disponibles

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor con nodemon |
| `npm start` | Iniciar servidor en producción |
| `npm run prisma:migrate` | Crear migración |
| `npm run prisma:push` | Sincronizar schema |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npm run prisma:seed` | Ejecutar seed |
| `npm run prisma:generate` | Regenerar Prisma Client |
| `npm run prisma:reset` | Resetear base de datos |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run preview` | Vista previa de build |

### Supabase Local

```bash
cd database
supabase start       # Iniciar Supabase local
supabase stop        # Detener Supabase
supabase db push     # Sincronizar schema
supabase db diff     # Ver diferencias
```

## API REST

### Autenticación

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/auth/me` | Perfil actual | Autenticado |

### Usuarios

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/users` | Listar usuarios | ADMIN |
| GET | `/api/users/:id` | Obtener usuario | ADMIN |
| PUT | `/api/users/:id` | Actualizar usuario | ADMIN |
| DELETE | `/api/users/:id` | Eliminar usuario | ADMIN |

### Clientes

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/clientes` | Listar clientes | ADMIN |
| GET | `/api/clientes/:id` | Obtener cliente | ADMIN/CLIENTE |
| PUT | `/api/clientes/:id` | Actualizar cliente | ADMIN/CLIENTE |
| DELETE | `/api/clientes/:id` | Eliminar cliente | ADMIN |

### Choferes

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/choferes` | Listar choferes | ADMIN |
| GET | `/api/choferes/:id` | Obtener chofer | ADMIN/CHOFER |
| POST | `/api/choferes` | Crear chofer | ADMIN |
| PUT | `/api/choferes/:id` | Actualizar chofer | ADMIN |
| DELETE | `/api/choferes/:id` | Eliminar chofer | ADMIN |
| GET | `/api/choferes/:id/contactos` | Contactos de emergencia | ADMIN/CHOFER |
| POST | `/api/choferes/:id/contactos` | Agregar contacto | ADMIN |
| DELETE | `/api/contactos/:id` | Eliminar contacto | ADMIN |

### Vehículos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/vehiculos` | Listar vehículos | ADMIN |
| GET | `/api/vehiculos/:id` | Obtener vehículo | ADMIN/CHOFER |
| POST | `/api/vehiculos` | Crear vehículo | ADMIN |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo | ADMIN |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo | ADMIN |

### Bancos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/bancos` | Listar bancos | ADMIN |
| POST | `/api/bancos` | Crear banco | ADMIN |
| PUT | `/api/bancos/:id` | Actualizar banco | ADMIN |
| DELETE | `/api/bancos/:id` | Eliminar banco | ADMIN |

### Recargas

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/recargas` | Listar recargas | ADMIN/CLIENTE |
| POST | `/api/recargas` | Registrar recarga | CLIENTE |
| GET | `/api/recargas/:id` | Obtener recarga | ADMIN/CLIENTE |

### Traslados

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/traslados` | Listar traslados | ADMIN/CLIENTE/CHOFER |
| POST | `/api/traslados` | Crear traslado | CLIENTE |
| GET | `/api/traslados/:id` | Obtener traslado | ADMIN/CLIENTE/CHOFER |
| PUT | `/api/traslados/:id/estado` | Actualizar estado | CHOFER |

### Pagos a Choferes

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/pagos` | Listar pagos | ADMIN/ADMINISTRATIVO |
| POST | `/api/pagos` | Registrar pago | ADMINISTRATIVO |

### Pruebas Psicológicas

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/pruebas-psicologicas` | Listar pruebas | ADMIN |
| POST | `/api/pruebas-psicologicas` | Crear prueba | ADMIN |
| GET | `/api/pruebas-psicologicas/:id` | Obtener prueba | ADMIN |
| PUT | `/api/pruebas-psicologicas/:id` | Actualizar prueba | ADMIN |

### Revisiones de Vehículo

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/revisiones-vehiculo` | Listar revisiones | ADMIN |
| POST | `/api/revisiones-vehiculo` | Crear revisión | ADMIN |
| GET | `/api/revisiones-vehiculo/:id` | Obtener revisión | ADMIN |
| PUT | `/api/revisiones-vehiculo/:id` | Actualizar revisión | ADMIN |

### Reportes

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/reportes/traslados` | Reporte traslados | ADMIN |
| GET | `/api/reportes/choferes` | Reporte choferes | ADMIN |
| GET | `/api/reportes/financiero` | Reporte financiero | ADMIN |

## Modelo de Negocio

1. El cliente solicita un traslado especificando origen, destino y distancia
2. Se calcula el costo: `monto_total = distancia_km × tarifa_km`
3. Se verifica que el cliente tenga saldo suficiente
4. Se descuenta el saldo al cliente
5. Se asigna aleatoriamente un chofer con vehículo activo
6. La empresa retiene el 30% del monto total
7. El chofer recibe el 70% como saldo pendiente
8. El administrativo registra pagos al chofer cuando lo solicite

## Roles del Sistema

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso total al sistema |
| **CLIENTE** | Solicitar traslados, recargar saldo, ver historial |
| **CHOFER** | Ver traslados asignados, actualizar estado |
| **ADMINISTRATIVO** | Gestionar pagos a choferes |

## Convenciones de Git

### Ramas

```
main              # Producción
├── develop       # Desarrollo
    ├── feature/* # Nuevas funcionalidades
    ├── fix/*     # Correcciones
    └── docs/*    # Documentación
```

### Commits (Conventional Commits)

```
feat: descripción   # Nueva funcionalidad
fix: descripción    # Corrección de bug
docs: descripción   # Documentación
refactor: desc.     # Refactorización
chore: descripción  # Tareas de mantenimiento
```

### Flujo de Trabajo

1. Crear rama desde `develop`: `git checkout -b feature/mi-feature`
2. Realizar cambios y commits
3. `git push origin feature/mi-feature`
4. Crear Pull Request a `develop`
5. Code review por otro integrante
6. Merge a `develop`

## Integrantes (5 personas)

| Integrante | Responsabilidad |
|------------|-----------------|
| 1 | Backend API (rutas, controladores, servicios, middlewares) |
| 2 | Frontend (páginas, componentes, layouts, rutas) |
| 3 | Base de datos (schema, seeds, migraciones, Supabase) |
| 4 | Autenticación y autorización + pruebas |
| 5 | Documentación, reportes y despliegue |

## Licencia

Proyecto académico — Universidad
