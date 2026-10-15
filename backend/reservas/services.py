from django.db import transaction
from rest_framework.exceptions import ValidationError

from .repositories import AdicionalRepository, ReservaRepository


class ReservaService:
    @staticmethod
    @transaction.atomic
    def crear_reserva(datos):
        habitacion = datos["id_habitacion"]
        desde = datos["desde"]
        hasta = datos["hasta"]
        huespedes = datos["huespedes"]

        type(habitacion).objects.select_for_update().get(pk=habitacion.pk)

        if huespedes > habitacion.capacidad:
            raise ValidationError(
                {
                    "huespedes": "La cantidad de huéspedes supera la capacidad de la habitación."
                }
            )

        if ReservaRepository.existe_superposicion(habitacion, desde, hasta):
            raise ValidationError(
                {
                    "id_habitacion": "La habitación no está disponible en las fechas seleccionadas."
                }
            )

        return ReservaRepository.crear(datos.copy())


class AdicionalService:
    @staticmethod
    def obtener_todos():
        return AdicionalRepository.obtener_todos()
