from django.contrib import admin
from .models import ImagenAnomalia

@admin.register(ImagenAnomalia)
class ImagenAnomaliaAdmin(admin.ModelAdmin):
    """
    Definición de la clase ImagenAnomaliaAdmin para personalizar la vista de administración de ImagenAnomalia
    """
    list_display = ('uuid_imagen_anomalia', 'get_codigo_anomalia')
    search_fields = ('uuid_imagen_anomalia',)

    def get_codigo_anomalia(self, obj):
        return obj.uuid_anomalia.codigo_anomalia  # Mostrar código de la anomalía
    get_codigo_anomalia.short_description = 'Código Anomalía'
