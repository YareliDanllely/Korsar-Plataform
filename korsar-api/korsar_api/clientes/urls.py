from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)

# Definir las URLs de la app
urlpatterns = [
    path('', include(router.urls)),
]
