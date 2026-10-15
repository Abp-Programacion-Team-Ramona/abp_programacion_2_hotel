from .models import Adicional, Reserva


class ReservaRepository:
    @staticmethod
    def existe_superposicion(habitacion, desde, hasta):
        return (
            Reserva.objects.filter(
                id_habitacion=habitacion, desde__lt=hasta, hasta__gt=desde
            )
            .exclude(estado="cancelada")
            .exists()
        )

    @staticmethod
    def crear(datos):
        adicionales = datos.pop("adicionales", [])

        reserva = Reserva.objects.create(**datos)
        reserva.adicionales.set(adicionales)

        return reserva


class AdicionalRepository:
    @staticmethod
    def obtener_todos():
        return Adicional.objects.all().order_by("nombre")
