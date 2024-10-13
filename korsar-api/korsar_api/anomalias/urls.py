from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnomaliaViewSet, AnomaliaListView

# Crear un router para las rutas CRUD
router = DefaultRouter()
router.register(r'items', AnomaliaViewSet)  # Registrar rutas CRUD con el prefijo 'items'

# Definir las URLs de la app
urlpatterns = [
    path('', include(router.urls)),  # Incluir todas las rutas del router
    path('recientes/', AnomaliaListView.as_view(), name='anomalias-recientes'),  # Ruta adicional para las anomalías recientes
]
