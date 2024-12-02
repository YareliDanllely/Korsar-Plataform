from django.contrib import admin
from .models import ComponenteAerogenerador

@admin.register(ComponenteAerogenerador)
class ComponenteAerogeneradorAdmin(admin.ModelAdmin):
    """
    Definir la clase ComponenteAerogeneradorAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar los campos del modelo ComponenteAerogenerador en la lista
    list_display = (
        'uuid_componente',
        'get_numero_aerogenerador',  # Mostrar el número del aerogenerador relacionado
        'tipo_componente',
    )

    # Permitir la búsqueda por tipo de componente y ruta de imagen
    search_fields = ('tipo_componente',)

    # Filtros laterales
    list_filter = ('uuid_aerogenerador__numero_aerogenerador',)

    # Método para mostrar el número del aerogenerador relacionado
    def get_numero_aerogenerador(self, obj):
        return obj.uuid_aerogenerador.numero_aerogenerador  # Accede al número del aerogenerador relacionado
    get_numero_aerogenerador.short_description = 'Número del Aerogenerador'
