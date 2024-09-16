from django.contrib import admin
from .models import EstadoComponente

@admin.register(EstadoComponente)
class EstadoComponenteAdmin(admin.ModelAdmin):
    """
    Definir la clase EstadoComponenteAdmin para personalizar la vista de administración de EstadoComponente
    """

    # Mostrar los campos del modelo EstadoComponente en la lista
    list_display = ('get_nombre_componente', 'get_fecha_inspeccion', 'estado_final_clasificacion', 'progreso')

    # Permitir la búsqueda por estado final y progreso
    search_fields = ('estado_final_clasificacion', 'progreso')

    # Método para mostrar el nombre del componente relacionado
    def get_nombre_componente(self, obj):
        return obj.uuid_componente.tipo_componente  # Mostrar el nombre del componente
    get_nombre_componente.short_description = 'Componente'

    # Método para mostrar la fecha de la inspección relacionada
    def get_fecha_inspeccion(self, obj):
        return obj.uuid_inspeccion.fecha_inspeccion  # Mostrar la fecha de la inspección
    get_fecha_inspeccion.short_description = 'Fecha de Inspección'
