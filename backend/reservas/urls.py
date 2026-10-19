from django.urls import path

from .views import DisponibilidadAPIView, ReservaAPIView, ReservaEstadoAPIView

urlpatterns = [
    path("", ReservaAPIView.as_view(), name="crear-reserva"),
    path(
        "disponibilidad/",
        DisponibilidadAPIView.as_view(),
        name="disponibilidad-reserva",
    ),
    path(
        "<uuid:id_reserva>/",
        ReservaEstadoAPIView.as_view(),
        name="actualizar-estado-reserva",
    ),
]
