from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImagenViewSet

# Definir el enrutador para la API
router = DefaultRouter()
router.register(r'items', ImagenViewSet, basename='imagenes')

urlpatterns = [
    path('', include(router.urls)),  # Rutas generadas por el ViewSet
]
