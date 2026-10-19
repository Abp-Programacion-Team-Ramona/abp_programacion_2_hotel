from .models import Habitacion


class HabitacionRepository:
    @staticmethod
    def obtener_todas():
        return Habitacion.objects.all().order_by("numero")
