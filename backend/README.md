# Backend — Hotel Ramona

Backend desarrollado con Django, Django REST Framework y MySQL.

## Instalación local

### 1. Entrar al backend

cd backend

### 2. Crear un entorno virtual

py -m venv .venv

en PowerShell:

.\.venv\Scripts\Activate.ps1

### 3. Instalar dependencias

python -m pip install -r requirements.txt

### 4. Configurar MySQL

Crear una base de datos local:

CREATE DATABASE hotel_ramona
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

Copiar `.env.example` como `.env` y completar las credenciales locales de MySQL.

### 5. Aplicar migraciones

python manage.py migrate

### 6. Iniciar el servidor

python manage.py runserver

El backend esta disponible en:

`http://127.0.0.1:8000/`

## Tecnologías

- Django: framework backend.
- Django REST Framework: construcción de APIs REST.
- MySQL: base de datos relacional.
- django-cors-headers: comunicación con Angular.
- python-dotenv: configuración mediante variables de entorno.
