from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpresaViewSet

router = DefaultRouter()
router.register(r'items', EmpresaViewSet)
# Definir las URLs de la app
urlpatterns = [
    path('', include(router.urls)),
]
