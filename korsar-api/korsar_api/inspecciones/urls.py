from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InspeccionViewSet


## Define las rutas de la API para las inspecciones
router = DefaultRouter()
router.register(r'inspecciones', InspeccionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
