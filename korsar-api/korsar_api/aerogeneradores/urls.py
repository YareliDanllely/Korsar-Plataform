from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AerogeneradorViewSet

router = DefaultRouter()
router.register(r'items', AerogeneradorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
