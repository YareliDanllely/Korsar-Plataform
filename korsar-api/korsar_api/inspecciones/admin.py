from django.contrib import admin
from .models import Inspeccion

@admin.register(Inspeccion)
class InspeccionAdmin(admin.ModelAdmin):
    """
    Definir la clase InspeccionAdmin para personalizar la vista de administración de Inspeccion
    """
    list_display = ('get_nombre_parque', 'fecha_inspeccion', 'fecha_siguiente_inspeccion', 'progreso')
    search_fields = ('id_parque__nombre_parque', 'progreso')

    def get_nombre_parque(self, obj):
        return obj.id_parque.nombre_parque  # Mostrar el nombre del parque eólico
    get_nombre_parque.short_description = 'Parque Eólico'
