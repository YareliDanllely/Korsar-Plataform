from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstadoAerogeneradoresViewSet


## Definir el enrutador para la API
router = DefaultRouter()
router.register(r'estado_aerogeneradores', EstadoAerogeneradoresViewSet)

urlpatterns = [
    path('', include(router.urls)),
]