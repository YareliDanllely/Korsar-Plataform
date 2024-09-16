from django.contrib import admin
from .models import ComponenteAerogenerador

@admin.register(ComponenteAerogenerador)
class ComponenteAerogeneradorAdmin(admin.ModelAdmin):
    """
    Definir la clase ComponenteAerogeneradorAdmin para personalizar la interfaz de administrador de Django
    """

    # Mostrar los campos del modelo ComponenteAerogenerador en la lista
    list_display = ('uuid_componente', 'get_numero_aerogenerador', 'tipo_componente', 'coordenada_longitud', 'coordenada_latitud', 'ruta_imagen_visualizacion_componente')

    # Permitir la búsqueda por tipo de componente y ruta de imagen
    search_fields = ('tipo_componente', 'ruta_imagen_visualizacion_componente')


    # Método para mostrar la relación con Aerogenerador
    def get_numero_aerogenerador(self, obj):
        return obj.id_aerogenerador.numero_aerogenerador  # Mostrar el número del aerogenerador
    get_numero_aerogenerador.short_description = 'Número del Aerogenerador'
