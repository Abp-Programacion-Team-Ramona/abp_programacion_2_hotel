from django.urls import path

from .views import LoginAPIView, UsuarioAPIView, UsuarioDetailAPIView

urlpatterns = [
    path("usuarios/", UsuarioAPIView.as_view()),
    path("usuarios/<uuid:pk>/", UsuarioDetailAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
]
