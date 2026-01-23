# Estructura de Base de Datos

## Tablas Principales

### users
id (PK)
name
email (UNIQUE)
email_verified_at
password
remember_token
role (admin, usuario, recurso)
created_at
updated_at

### reservas
id (PK)
user_id (FK)
recurso_id (FK)
fecha_inicio
fecha_fin
estado (pendiente, confirmada, cancelada)
created_at
updated_at

### recursos
id (PK)
nombre
descripcion
disponible (boolean)
created_at
updated_at

### migrations
id (PK)
migration
batch

## Relaciones

- User → Reservas (1:N)
- Recurso → Reservas (1:N)

## Seeders

Se ejecutan con:
php artisan migrate --seed