from django.contrib import admin
from .models import EstadoAerogenerador

@admin.register(EstadoAerogenerador)
class EstadoAerogeneradoresAdmin(admin.ModelAdmin):
    """
    Clase EstadoAerogeneradoresAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar los campos del modelo EstadoAerogenerador en la lista
    list_display = (
        'uuid_estado',
        'get_numero_aerogenerador',
        'get_fecha_inspeccion',
        'estado_final_clasificacion',
    )

    # Permitir la búsqueda por estado final de clasificación y progreso
    search_fields = ('estado_final_clasificacion',)

    # Agregar filtros por estado final de clasificación
    list_filter = ('estado_final_clasificacion',)

    # Método para mostrar el número de aerogenerador relacionado
    def get_numero_aerogenerador(self, obj):
        return obj.uuid_aerogenerador.numero_aerogenerador  # Asegúrate de que el modelo Aerogenerador tiene este campo
    get_numero_aerogenerador.short_description = 'Número del Aerogenerador'

    # Método para mostrar la fecha de inspección relacionada
    def get_fecha_inspeccion(self, obj):
        return obj.uuid_inspeccion.fecha_inspeccion  # Asegúrate de que el modelo Inspeccion tiene este campo
    get_fecha_inspeccion.short_description = 'Fecha de Inspección'
