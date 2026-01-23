# Arquitectura del Proyecto

## Visión General

El proyecto está dividido en tres capas principales:

### 1. Backend (Laravel)
- API REST para gestión de reservas
- Autenticación con Sanctum
- Base de datos MySQL
- Controladores y modelos

### 2. Frontend (Next.js)
- Interfaz web con React
- Consumo de API del backend
- Estilos con Tailwind CSS
- Componentes reutilizables

### 3. Scripts Python
- Validaciones de datos
- Lógica de disponibilidad
- Control de acceso y permisos
- Estructuras de control

## Flujo de Datos

Frontend (Next.js)
↓
API Call
↓
Backend (Laravel)
↓
Validación (Python)
↓
Database (MySQL)

text

## Modelos Principales

### User
- id
- name
- email
- password
- role (admin, usuario, recurso)

### Reserva
- id
- user_id
- recurso_id
- fecha_inicio
- fecha_fin
- estado

### Recurso
- id
- nombre
- descripcion
- disponibilidad

## Rutas Principales

### Autenticación
- POST /api/login
- POST /api/register
- POST /api/logout

### Reservas
- GET /api/reservas
- POST /api/reservas
- PUT /api/reservas/{id}
- DELETE /api/reservas/{id}

### Admin
- GET /api/usuarios (solo admin)
- PUT /api/usuarios/{id} (solo admin)