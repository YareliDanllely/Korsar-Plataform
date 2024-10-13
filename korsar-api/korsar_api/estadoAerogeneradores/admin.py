from django.contrib import admin
from .models import EstadoAerogenerador

@admin.register(EstadoAerogenerador)
class EstadoAerogeneradoresAdmin(admin.ModelAdmin):
    """
    Definir la clase EstadoAerogeneradoresAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar los campos del modelo EstadoAerogenerador en la lista
    list_display = (
        'uuid_estado',
        'get_numero_aerogenerador',
        'get_fecha_inspeccion',
        'estado_final_clasificacion',
        'progreso'
    )

    # Permitir la búsqueda por estado final y progreso
    search_fields = ('estado_final_clasificacion', 'progreso')

    # Agregar filtros por estado final y progreso
    list_filter = ('estado_final_clasificacion', 'progreso')

    # Método para mostrar la relación con el Aerogenerador
    def get_numero_aerogenerador(self, obj):
        return obj.uuid_aerogenerador.numero_aerogenerador  # Acceder al número del aerogenerador relacionado
    get_numero_aerogenerador.short_description = 'Número del Aerogenerador'

    # Método para mostrar la fecha de inspección
    def get_fecha_inspeccion(self, obj):
        return obj.uuid_inspeccion.fecha_inspeccion  # Acceder a la fecha de la inspección relacionada
    get_fecha_inspeccion.short_description = 'Fecha de Inspección'
