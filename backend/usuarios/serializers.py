from rest_framework import serializers
from .models import Rol, Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "nombre",
            "apellido",
            "email",
            "num_contacto",
            "password",
            "id_rol",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "id_rol": {"required": False, "allow_null": True},
        }

    def create(self, validated_data):
        if "id_rol" not in validated_data or not validated_data["id_rol"]:
            rol_cliente, _ = Rol.objects.get_or_create(descripcion="Cliente")
            validated_data["id_rol"] = rol_cliente

        return super().create(validated_data)