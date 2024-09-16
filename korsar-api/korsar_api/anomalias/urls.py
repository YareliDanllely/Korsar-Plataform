from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnomaliaViewSet

router = DefaultRouter()
router.register(r'anomalias', AnomaliaViewSet)

# Definir las URLs de la app
urlpatterns = [
    path('', include(router.urls)),
]
