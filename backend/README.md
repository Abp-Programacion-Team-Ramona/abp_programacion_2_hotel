# Hotel Ramona — Backend

Backend desarrollado con **Django REST Framework** y **MySQL** para el sistema de gestión de reservas del Hotel Ramona.

## Requisitos previos

- Python compatible con Django 5.2
- MySQL 8
- Git

## 1. Clonar el repositorio

```bash
git clone https://github.com/Abp-Programacion-Team-Ramona/abp_programacion_2_hotel.git
cd abp_programacion_2_hotel/backend
```

## 2. Crear el entorno virtual

Desde la carpeta `backend`:

```powershell
py -m venv .venv
.venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

## 3. Crear la base de datos

Desde MySQL Workbench, DBeaver o la consola de MySQL, ejecutar:

```sql
CREATE DATABASE hotel_ramona
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

No es necesario crear las tablas manualmente.

## 4. Configurar las variables de entorno

Copiar el archivo `.env.example`:

```powershell
Copy-Item .env.example .env
```

Editar `.env` con las credenciales locales de MySQL:

```dotenv
DB_NAME=hotel_ramona
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_HOST=127.0.0.1
DB_PORT=3306
```

El archivo `.env` es privado y no debe subirse al repositorio.

## 5. Crear las tablas y cargar los datos iniciales

Ejecutar:

```bash
python manage.py migrate
```

Este comando aplica las migraciones existentes y crea automáticamente:

- Las tablas correspondientes a los modelos de Django.
- Los roles: Administrador, Empleado y Cliente.
- Las habitaciones iniciales: 101, 201 y 202.
- Los ocho servicios adicionales disponibles.

**No es necesario ejecutar `makemigrations`** para instalar el proyecto. Las migraciones ya están incluidas en el repositorio.

## 5.1. Crear un usuario de prueba (temporal)

Las migraciones generan los roles, habitaciones y servicios adicionales, pero **no crean usuarios automáticamente**.

Mientras se desarrolla la funcionalidad de registro e inicio de sesión, es posible crear un usuario de prueba desde Django Shell.

### Abrir Django Shell

Desde la carpeta `backend`, con el entorno virtual activado:

```bash
python manage.py shell
```

### Crear el usuario

Ejecutar el siguiente código:

```python
from usuarios.models import Usuario, Rol
from django.contrib.auth.hashers import make_password

rol_cliente = Rol.objects.get(descripcion="Cliente")

usuario = Usuario.objects.create(
    id_rol=rol_cliente,
    nombre="Usuario",
    apellido="Prueba",
    email="prueba@hotelramona.com",
    password=make_password("Prueba123!"),
    num_contacto="3511234567",
)

print(usuario.id)
```

Django generará automáticamente un UUID para el usuario. Guardar ese identificador para realizar pruebas.

Para salir de Django Shell:

```python
exit()
```

### Utilizar el usuario desde Angular

Actualmente, el formulario de reservas utiliza un UUID temporal en `reservartion-form.ts`:

```typescript
id_usuario: 'dfb01126-6e4e-4d28-b0e0-d2b61c4271d3',
```

**Ese UUID corresponde a una base de datos local y no funcionará en otras instalaciones.**

Cada integrante deberá reemplazarlo temporalmente por el UUID que obtuvo al crear su propio usuario.

Además, mientras no esté integrado el login definitivo, el formulario requiere que exista un objeto `currentUser` en `localStorage` para permitir el envío. Crear el usuario en MySQL no inicia sesión automáticamente en Angular.

### Importante

- Este procedimiento es exclusivamente para desarrollo y pruebas locales.
- No es necesario compartir bases de datos ni archivos SQL.
- No se deben subir usuarios de prueba ni contraseñas reales al repositorio.
- Cuando se integre el registro y login, Angular deberá obtener el UUID del usuario autenticado, en lugar de utilizar uno fijo.

---


## 6. Iniciar el servidor

```bash
python manage.py runserver
```

La API estará disponible en:

`http://127.0.0.1:8000/`

## Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/habitaciones/` | Listar habitaciones |
| GET | `/api/v1/adicionales/` | Listar servicios adicionales |
| POST | `/api/v1/reservas/` | Crear una reserva |

### Ejemplo de creación de reserva

```json
{
  "id_usuario": "UUID_DE_UN_USUARIO_EXISTENTE",
  "id_habitacion": "UUID_DE_UNA_HABITACION_EXISTENTE",
  "desde": "2026-11-20",
  "hasta": "2026-11-22",
  "huespedes": 2,
  "observaciones": "Reserva de prueba",
  "adicionales": []
}
```

Los UUID de las habitaciones se pueden obtener mediante `GET /api/v1/habitaciones/`.

## Consideraciones importantes

- Las migraciones cargan roles, habitaciones y adicionales, pero **no crean usuarios de prueba**.
- Para crear una reserva debe existir previamente un usuario válido en la base de datos.
- La integración del formulario con el sistema de login está pendiente.
- El backend valida las fechas, la capacidad de la habitación y la disponibilidad antes de guardar una reserva.
- Cada integrante utiliza su propia base de datos MySQL local. No es necesario compartir un dump de la base de datos.

## Tecnologías

- Django 5.2
- Django REST Framework
- MySQL 8
- django-cors-headers
- python-dotenv
