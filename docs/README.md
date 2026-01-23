# SGRA - Sistema de Gestión de Reservas Automático

Proyecto intermodular de 2º DAW (Desarrollo de Aplicaciones Web) - Formación Profesional Superior.

## Estructura del Proyecto

SGRA/
├── backend/ # Laravel API
├── frontend/ # Next.js + React + Tailwind
├── scripts/ # Python (validaciones y lógica)
├── docs/ # Documentación
└── .gitignore


## Tecnologías

- **Backend**: Laravel 11, MySQL/MariaDB, PHP 8.2
- **Frontend**: Next.js 14, React, Tailwind CSS 4
- **Python**: Validaciones y lógica de negocio
- **Control de versiones**: Git

## Instalación

### Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

### Frontend
cd frontend
npm install
npm run dev

### Python
cd scripts
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

## Módulos Integrados
DPL: Despliegue en servidor XAMPP
IPW: Backend con Laravel
DEW: Frontend con Next.js y React Hooks
DOR: Diseño con Tailwind CSS
DSW: Base de datos, autenticación, perfiles
Python: Validaciones, control de acceso

## Endpoints API
GET /api/reservas - Listar reservas
POST /api/reservas - Crear reserva
GET /api/reservas/{id} - Ver detalle
PUT /api/reservas/{id} - Editar reserva
DELETE /api/reservas/{id} - Eliminar reserva

## Contribuidores
Alberto C.G.

## Licencia
Este proyecto es académico.