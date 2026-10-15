from django.urls import path

from .views import HabitacionAPIView

urlpatterns = [
    path("", HabitacionAPIView.as_view(), name="listar-habitaciones"),
]
