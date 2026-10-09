import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Adicional(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    nombre = models.CharField(max_length=100, unique=True)

    precio = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return self.nombre


class Reserva(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    id_usuario = models.ForeignKey(
        "usuarios.Usuario", on_delete=models.PROTECT, db_column="id_usuario"
    )

    id_habitacion = models.ForeignKey(
        "habitaciones.Habitacion", on_delete=models.PROTECT, db_column="id_habitacion"
    )

    desde = models.DateField()
    hasta = models.DateField()

    huespedes = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)]
    )

    observaciones = models.TextField(blank=True)

    estado = models.CharField(max_length=20, default="pendiente")

    adicionales = models.ManyToManyField(Adicional, blank=True, related_name="reservas")

    def __str__(self):
        return f"Reserva {self.id}"
