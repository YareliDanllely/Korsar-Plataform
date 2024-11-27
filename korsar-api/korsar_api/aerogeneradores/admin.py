from django.contrib import admin
from .models import Aerogenerador

@admin.register(Aerogenerador)
class AerogeneradorAdmin(admin.ModelAdmin):
    """
    Definir la clase AerogeneradorAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar todos los campos del modelo Aerogenerador en la lista
    list_display = (
        'uuid_aerogenerador',
        'get_nombre_parque_eolico',  # Mostrar el nombre del parque, no el UUID
        'numero_aerogenerador',
        'modelo_aerogenerador',
        'fabricante_aerogenerador',
        'altura_aerogenerador',
        'diametro_rotor',
        'potencia_nominal',
        'coordenada_longitud',
        'coordenada_latitud'
    )

    # Permitir la búsqueda por ciertos campos en la interfaz de administrador
    search_fields = ('modelo_aerogenerador', 'fabricante_aerogenerador', 'numero_aerogenerador')

    # Agregar filtros por parque y fabricante
    list_filter = ('fabricante_aerogenerador', 'potencia_nominal')

    # Mostrar el nombre del parque en lugar del UUID
    def get_nombre_parque_eolico(self, obj):
        return obj.uuid_parque_eolico.nombre_parque  # Acceder al nombre del parque relacionado
    get_nombre_parque_eolico.short_description = 'Nombre del Parque'

