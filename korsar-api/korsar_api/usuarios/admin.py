from django.contrib import admin

from django.contrib import admin
from .models import Usuario

# Registrar el modelo Usuario en el panel de administración
@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    """
    Clase para personalizar la vista del modelo Usuario en el panel de administración
    """
    list_display = ('username', 'email', 'tipo_usuario')  # Campos que se mostrarán en la lista
    search_fields = ('username', 'email')  # Campos para buscar usuarios
    list_filter = ('tipo_usuario',)  # Filtrar por tipo de usuario
