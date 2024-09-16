from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AerogeneradorViewSet

#Definir el enrutador para la vista de Aerogenerador
router = DefaultRouter()
router.register(r'aerogeneradores', AerogeneradorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
