from django.urls import path
from .views import UsuarioAPIView, UsuarioDetailAPIView

urlpatterns = [
    path("usuarios/", UsuarioAPIView.as_view()),
    path("usuarios/<uuid:pk>/", UsuarioDetailAPIView.as_view()),
]