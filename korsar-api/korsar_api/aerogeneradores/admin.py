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
        'get_nombre_parque',  # Mostrar el nombre del parque, no el UUID
        'get_ultimo_estado',  # Mostrar el estado final
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
    def get_nombre_parque(self, obj):
        return obj.uuid_parque.nombre_parque  # Acceder al nombre del parque relacionado
    get_nombre_parque.short_description = 'Nombre del Parque'

    # Mostrar el estado final del aerogenerador
    def get_ultimo_estado(self, obj):
        return obj.id_ultimo_estado.estado_final_clasificacion  # Acceder al estado relacionado
    get_ultimo_estado.short_description = 'Último Estado'
