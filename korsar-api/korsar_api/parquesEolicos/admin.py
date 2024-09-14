from django.contrib import admin
from .models import ParqueEolico

# Registrar el modelo en el panel de administración
@admin.register(ParqueEolico)
class ParqueEolicoAdmin(admin.ModelAdmin):
    """
    Definición los campos que se mostrarán en el panel de administración
    """
    list_display = ('nombre_parque', 'ubicacion_comuna', 'ubicacion_region', 'cantidad_turbinas', 'potencia_instalada')
    search_fields = ('nombre_parque', 'ubicacion_comuna', 'ubicacion_region')
