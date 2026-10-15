from django.urls import path

from .views import ReservaAPIView

urlpatterns = [
    path("", ReservaAPIView.as_view(), name="crear-reserva"),
]
