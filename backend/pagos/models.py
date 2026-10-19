import uuid

from django.core.validators import MinValueValidator
from django.db import models


class Pago(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    id_reserva = models.OneToOneField(
        "reservas.Reserva", on_delete=models.PROTECT, db_column="id_reserva"
    )

    medio = models.CharField(max_length=50)
    estado = models.CharField(max_length=20)

    monto = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return f"Pago {self.id}"
