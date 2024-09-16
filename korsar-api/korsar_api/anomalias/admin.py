from django.contrib import admin
from .models import Anomalia

@admin.register(Anomalia)
class AnomaliaAdmin(admin.ModelAdmin):
    """
    Definir la clase AnomaliaAdmin para personalizar la interfaz de administrador de Django
    """

    # Mostrar todos los campos del modelo Anomalia en la lista
    list_display = (
        'uuid_anomalia',  # Cambié id_anomalia a uuid_anomalia
        'codigo_anomalia',
        'severidad_anomalia',
        'dimension_anomalia',
        'orientacion_anomalia',
        'get_aerogenerador',  # Mostrar el número del aerogenerador
        'get_componente',  # Mostrar el tipo de componente
        'get_inspeccion',  # Mostrar la fecha de inspección
        'get_tecnico'  # Mostrar el nombre del técnico
    )

    # Campos de búsqueda
    search_fields = ('codigo_anomalia', 'descripcion_anomalia')

    # Filtros por severidad, aerogenerador y componente
    list_filter = ('severidad_anomalia', 'uuid_aerogenerador__numero_aerogenerador', 'uuid_componente__tipo_componente')

    # Métodos para mostrar las relaciones en lugar de los UUIDs
    def get_aerogenerador(self, obj):
        return obj.uuid_aerogenerador.numero_aerogenerador  # Mostrar el número del aerogenerador
    get_aerogenerador.short_description = 'Aerogenerador'

    def get_componente(self, obj):
        return obj.uuid_componente.tipo_componente  # Mostrar el tipo de componente
    get_componente.short_description = 'Componente'

    def get_inspeccion(self, obj):
        return obj.uuid_inspeccion.fecha_inspeccion  # Mostrar la fecha de la inspección
    get_inspeccion.short_description = 'Inspección'

    def get_tecnico(self, obj):
        return obj.uuid_tecnico.username  # Mostrar el nombre del técnico
    get_tecnico.short_description = 'Técnico'
