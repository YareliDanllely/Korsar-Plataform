from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImagenAnomaliaViewSet

## Definir el enrutador para la API
router = DefaultRouter()
router.register(r'imagen_anomalias', ImagenAnomaliaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]