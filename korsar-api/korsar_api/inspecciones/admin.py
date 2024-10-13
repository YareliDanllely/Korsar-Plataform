from django.contrib import admin
from .models import Inspeccion

@admin.register(Inspeccion)
class InspeccionAdmin(admin.ModelAdmin):
    """
    Definir la clase InspeccionAdmin para personalizar la vista de administración de Inspeccion
    """
    list_display = ('get_nombre_parque_eolico', 'fecha_inspeccion', 'fecha_siguiente_inspeccion', 'progreso')
    search_fields = ('id_parque_eolico__nombre_parque', 'progreso')

    def get_nombre_parque_eolico(self, obj):
        return obj.uuid_parque_eolico.nombre_parque  # Mostrar el nombre del parque eólico
    get_nombre_parque_eolico.short_description = 'Parque Eólico'
