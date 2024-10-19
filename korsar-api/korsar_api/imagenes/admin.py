from django.contrib import admin
from .models import Imagen

@admin.register(Imagen)
class ImagenAdmin(admin.ModelAdmin):
    """
    Definiendo la clase ImagenAdmin para personalizar la interfaz de administrador de Django
    """

    list_display = ('nombre_imagen', 'get_aerogenerador', 'get_componente', 'fecha_creacion', 'ruta_imagen', 'get_inspeccion', 'estado_clasificacion')
    search_fields = ('nombre_imagen', 'estado_clasificacion')

    def get_aerogenerador(self, obj):
        return obj.uuid_aerogenerador.numero_aerogenerador  # Mostrar número del aerogenerador
    get_aerogenerador.short_description = 'Número Aerogenerador'

    def get_componente(self, obj):
        return obj.uuid_componente.tipo_componente  # Mostrar tipo de componente
    get_componente.short_description = 'Componente'

    def get_inspeccion(self, obj):
        return obj.uuid_inspeccion.fecha_inspeccion  # Mostrar fecha de inspección
    get_inspeccion.short_description = 'Fecha Inspección'
