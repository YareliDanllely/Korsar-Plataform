from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Definir la clase UsuarioAdmin para personalizar la interfaz de administrador de Django.
    """
    # Mostrar los campos del modelo Usuario en la lista
    list_display = ('username', 'email', 'tipo_usuario', 'get_nombre_empresa')

    # Permitir la búsqueda por nombre de usuario y nombre de empresa
    search_fields = ('username', 'uuid_empresa__nombre_empresa')

    # Método para mostrar el nombre de la empresa
    def get_nombre_empresa(self, obj):
        return obj.uuid_empresa.nombre_empresa if obj.uuid_empresa else 'Sin Empresa'
    get_nombre_empresa.short_description = 'Nombre de la Empresa'
