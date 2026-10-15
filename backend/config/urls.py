from django.contrib import admin
from django.urls import include, path
from reservas.views import AdicionalAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/reservas/", include("reservas.urls")),
    path("api/v1/adicionales/", AdicionalAPIView.as_view(), name="listar-adicionales"),
    path("api/v1/habitaciones/", include("habitaciones.urls")),
]
