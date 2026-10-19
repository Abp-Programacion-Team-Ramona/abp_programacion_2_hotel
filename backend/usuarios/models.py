import uuid

from django.core.validators import RegexValidator
from django.db import models


class Rol(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    descripcion = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.descripcion


class Usuario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    id_rol = models.ForeignKey(Rol, on_delete=models.PROTECT, db_column="id_rol")

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128)

    num_contacto = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r"^\+?[0-9\s-]+$",
                message="El número de contacto contiene caracteres inválidos.",
            )
        ],
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
