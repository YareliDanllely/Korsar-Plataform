from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from django.shortcuts import redirect
from imagenes.views import ImagenFiltradaListView

def redirect_to_admin(request):
    return redirect('/admin/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', redirect_to_admin),  # Redirige a /admin/
    path('api/parques-eolicos/', include('parquesEolicos.urls')),  # Prefijo único para parques eólicos
    path('api/clientes/', include('clientes.urls')),  # Prefijo único para clientes
    path('api/imagenes/', include('imagenes.urls')),  # Prefijo único para imágenes
]
