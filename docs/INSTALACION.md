# Guía de Instalación

## Requisitos

- PHP 8.0+
- Node.js 16+
- MySQL/MariaDB 5.7+
- XAMPP (Apache, MySQL, PHP)
- Python 3.8+

## Pasos Iniciales

1. Clona el repositorio
git clone https://github.com/albertocg21/SGRA.git
cd SGRA

2. Instala el backend
cd backend
composer install
cp .env.example .env
php artisan key:generate

3. Configura la base de datos en .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sgra_db
DB_USERNAME=root
DB_PASSWORD=

4. Ejecuta las migraciones
php artisan migrate --seed

5. Instala el frontend
cd ../frontend
npm install

6. Configura variables de entorno .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

7. Instala dependencias de Python
cd ../scripts
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt


## Ejecución
En tres terminales diferentes:

### Terminal 1 (Backend):
cd backend
php artisan serve

### Terminal 2 (Frontend):
cd frontend
npm run dev

### Terminal 3 (Python - opcional):
cd scripts
venv\Scripts\activate
python main.py

## Acceso

Frontend: http://localhost:3000

Backend API: http://127.0.0.1:8000/api

phpMyAdmin: http://localhost/phpmyadmin