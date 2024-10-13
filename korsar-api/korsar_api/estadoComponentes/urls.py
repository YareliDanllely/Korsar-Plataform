from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstadoComponenteViewSet

## Definir el enrutador para la API
router = DefaultRouter()
router.register(r'items', EstadoComponenteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
