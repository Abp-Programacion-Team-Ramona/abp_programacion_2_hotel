import uuid

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reserva
from .serializers import (
    AdicionalSerializer,
    ReservaDetalleSerializer,
    ReservaSerializer,
)
from .services import AdicionalService, ReservaService


class ReservaAPIView(APIView):
    def get(self, request):
        id_usuario = request.query_params.get("id_usuario")

        if id_usuario:
            try:
                uuid.UUID(id_usuario)
            except (ValueError, TypeError):
                return Response(
                    {"id_usuario": "El identificador no es válido."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            reservas = ReservaService.obtener_por_usuario(id_usuario)
        else:
            reservas = Reserva.objects.all().order_by("-desde")

        serializer = ReservaDetalleSerializer(reservas, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        reserva = ReservaService.crear_reserva(serializer.validated_data)

        return Response(ReservaSerializer(reserva).data, status=status.HTTP_201_CREATED)


class DisponibilidadAPIView(APIView):
    def get(self, request):
        id_habitacion = request.query_params.get("id_habitacion")

        if not id_habitacion:
            return Response(
                {"id_habitacion": "El identificador de la habitación es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uuid.UUID(id_habitacion)
        except (ValueError, TypeError):
            return Response(
                {"id_habitacion": "El identificador no es válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reservas = (
            Reserva.objects.filter(id_habitacion_id=id_habitacion)
            .exclude(estado="cancelada")
            .values("desde", "hasta")
        )

        return Response(
            {"fechas_ocupadas": list(reservas)},
            status=status.HTTP_200_OK,
        )


class AdicionalAPIView(APIView):
    def get(self, request):
        adicionales = AdicionalService.obtener_todos()

        serializer = AdicionalSerializer(adicionales, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ReservaEstadoAPIView(APIView):
    def patch(self, request, id_reserva):
        nuevo_estado = request.data.get("estado")

        if nuevo_estado not in ["confirmada", "cancelada"]:
            return Response(
                {"estado": "El estado debe ser confirmada o cancelada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reserva = Reserva.objects.get(id=id_reserva)
        except Reserva.DoesNotExist:
            return Response(
                {"detail": "La reserva no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if reserva.estado == "cancelada":
            return Response(
                {"detail": "Una reserva cancelada no puede modificarse."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reserva.estado == "confirmada" and nuevo_estado == "confirmada":
            return Response(
                {"detail": "La reserva ya está confirmada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reserva.estado = nuevo_estado
        reserva.save(update_fields=["estado"])

        return Response(
            ReservaDetalleSerializer(reserva).data,
            status=status.HTTP_200_OK,
        )
