# Flujo de Trabajo con Git

## Ramas Principales

- `main`: Código en producción (100% funcional)
- `develop`: Rama de integración

## Ramas de Feature

feature/backend-api - Desarrollo de API
feature/frontend-ui - Componentes y páginas
feature/autenticacion - Login y permisos
feature/reservas-crud - CRUD de reservas
feature/python-scripts - Validaciones Python


## Flujo de Trabajo

1. Crea una rama desde `main`:
git checkout main
git pull origin main
git checkout -b feature/nombre-feature

2. Trabaja en tu rama y haz commits frecuentes:
git add .
git commit -m "Tipo: Descripción breve"

3. Sube cambios:
git push origin feature/nombre-feature

4. Abre un Pull Request en GitHub

5. Merge a main cuando esté aprobado:
git checkout main
git merge feature/nombre-feature
git push origin main

## Convención de Commits
feat: Nueva funcionalidad
fix: Corrección de error
docs: Cambios en documentación
style: Cambios de formato (sin lógica)
refactor: Refactorización de código
test: Añadir tests
chore: Cambios en herramientas

## Ejemplo:
git commit -m "feat: Crear modelo Reserva y migración"
git commit -m "fix: Corregir error de validación de fechas"
git commit -m "docs: Actualizar README"