from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParqueEolicoViewSet


router = DefaultRouter()
router.register(r'items-eolicos', ParqueEolicoViewSet)

# Definir las URLs de la app
urlpatterns = [
    path('', include(router.urls)),
]
