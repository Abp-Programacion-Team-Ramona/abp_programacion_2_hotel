import uuid
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    AdicionalSerializer,
    ReservaDetalleSerializer,
    ReservaSerializer,
)
from .services import AdicionalService, ReservaService


class ReservaAPIView(APIView):
    def get(self, request):
        id_usuario = request.query_params.get("id_usuario")

        if not id_usuario:
            return Response(
                {"id_usuario": "Este parámetro es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uuid.UUID(id_usuario)
        except ValueError:
            return Response(
                {"id_usuario": "El identificador no es válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reservas = ReservaService.obtener_por_usuario(id_usuario)
        serializer = ReservaDetalleSerializer(reservas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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