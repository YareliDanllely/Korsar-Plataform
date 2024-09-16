from django.contrib import admin
from .models import ParquesEolicos

@admin.register(ParquesEolicos)
class ParqueEolicoAdmin(admin.ModelAdmin):
    """
    Definición los campos que se mostrarán en el panel de administración
    """
    list_display = ('nombre_parque', 'ubicacion_comuna', 'ubicacion_region', 'cantidad_turbinas', 'potencia_instalada', 'coordenada_longitud', 'coordenada_latitud')
    search_fields = ('nombre_parque', 'ubicacion_comuna', 'ubicacion_region')
