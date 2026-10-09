from .repositories import HabitacionRepository


class HabitacionService:
    @staticmethod
    def obtener_todas():
        return HabitacionRepository.obtener_todas()
