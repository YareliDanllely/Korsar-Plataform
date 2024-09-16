from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    """
    Definir la clase ClienteAdmin para personalizar la interfaz de administrador de Django.
    """

    # Mostrar los campos del modelo Cliente en la lista
    list_display = ('uuid_cliente', 'get_nombre_parque', 'get_username_usuario')

    # Permitir la búsqueda por nombre de usuario y nombre de parque
    search_fields = ('id_usuario__username', 'id_parque_eolico__nombre_parque')

    # Métodos para mostrar las relaciones de forma legible
    def get_nombre_parque(self, obj):
        return obj.id_parque_eolico.nombre_parque  # Mostrar el nombre del parque eólico
    get_nombre_parque.short_description = 'Nombre del Parque Eólico'

    def get_username_usuario(self, obj):
        return obj.id_usuario.username  # Mostrar el nombre de usuario
    get_username_usuario.short_description = 'Nombre de Usuario'
