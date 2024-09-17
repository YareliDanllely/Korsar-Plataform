from django.contrib import admin
from .models import Empresa

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    """
    Definir la clase EmpresaAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar los campos del modelo Empresa en la lista
    list_display = ('uuid_empresa', 'nombre_empresa', 'get_nombre_parque')

    # Permitir la búsqueda por nombre de empresa y nombre de parque
    search_fields = ('nombre_empresa', 'uuid_parque_eolico__nombre_parque')

    # Método para mostrar el nombre del parque eólico asociado
    def get_nombre_parque(self, obj):
        return obj.uuid_parque_eolico.nombre_parque  # Mostrar el nombre del parque eólico
    get_nombre_parque.short_description = 'Nombre del Parque Eólico'
