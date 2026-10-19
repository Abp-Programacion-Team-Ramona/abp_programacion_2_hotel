from rest_framework import serializers
from .models import Adicional, Reserva


class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva

        fields = [
            "id",
            "id_usuario",
            "id_habitacion",
            "desde",
            "hasta",
            "huespedes",
            "observaciones",
            "estado",
            "adicionales",
        ]

        read_only_fields = ["id", "estado"]

    def validate(self, attrs):
        desde = attrs["desde"]
        hasta = attrs["hasta"]

        if hasta <= desde:
            raise serializers.ValidationError(
                {"hasta": "La fecha de salida debe ser posterior a la de entrada."}
            )

        return attrs


class AdicionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adicional
        fields = [
            "id",
            "nombre",
            "precio",
        ]
        
class ReservaDetalleSerializer(serializers.ModelSerializer):
    numero_habitacion = serializers.IntegerField(
        source="id_habitacion.numero", read_only=True
    )
    adicionales = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="nombre"
    )

    class Meta:
        model = Reserva
        fields = [
            "id",
            "id_usuario",
            "id_habitacion",
            "numero_habitacion",
            "desde",
            "hasta",
            "huespedes",
            "observaciones",
            "estado",
            "adicionales",
        ]
        read_only_fields = fields