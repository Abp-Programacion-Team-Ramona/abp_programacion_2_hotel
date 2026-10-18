from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Usuario

class LoginAPIView(APIView):
    def post(self, request):
        email = str(request.data.get("email", "")).strip()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"detail": "Email y contraseña son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            usuario = Usuario.objects.select_related("id_rol").get(email__iexact=email)
        except Usuario.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not check_password(password, usuario.password):
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "id": str(usuario.id),
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "rol": usuario.id_rol.descripcion,
            },
            status=status.HTTP_200_OK,
        )