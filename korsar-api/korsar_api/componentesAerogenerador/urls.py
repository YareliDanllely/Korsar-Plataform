from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComponenteAerogeneradorViewSet


## Define las rutas de la API para los componentes de aerogenerador
router = DefaultRouter()
router.register(r'items', ComponenteAerogeneradorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
