import uuid

from django.core.validators import MinValueValidator
from django.db import models


class Habitacion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    numero = models.PositiveIntegerField(unique=True)
    tipo = models.CharField(max_length=50)

    capacidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    precio = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return f"Habitación {self.numero} - {self.tipo}"
