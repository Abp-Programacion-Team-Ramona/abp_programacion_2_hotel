from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HabitacionSerializer
from .services import HabitacionService


class HabitacionAPIView(APIView):
    def get(self, request):
        habitaciones = HabitacionService.obtener_todas()

        serializer = HabitacionSerializer(habitaciones, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
