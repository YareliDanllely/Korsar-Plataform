from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Clase para personalizar la vista del modelo Usuario en el panel de administración
    """
    list_display = ('username', 'email', 'tipo_usuario', 'nombre_empresa', 'telefono')  # Mostrar los campos relevantes
    search_fields = ('username', 'email', 'tipo_usuario')  # Campos para buscar usuarios
