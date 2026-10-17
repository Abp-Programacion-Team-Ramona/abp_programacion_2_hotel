from django.urls import path

from .views import UsuarioAPIView

urlpatterns = [
    path("usuarios/", UsuarioAPIView.as_view()),
]