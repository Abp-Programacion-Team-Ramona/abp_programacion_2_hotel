from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AdicionalSerializer, ReservaSerializer
from .services import AdicionalService, ReservaService


class ReservaAPIView(APIView):
    def post(self, request):
        serializer = ReservaSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        reserva = ReservaService.crear_reserva(serializer.validated_data)

        return Response(ReservaSerializer(reserva).data, status=status.HTTP_201_CREATED)


class AdicionalAPIView(APIView):
    def get(self, request):
        adicionales = AdicionalService.obtener_todos()

        serializer = AdicionalSerializer(adicionales, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
