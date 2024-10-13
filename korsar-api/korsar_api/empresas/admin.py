from django.contrib import admin
from .models import Empresa

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    """
    Configuración de la interfaz de administrador para el modelo Empresa.
    """

    # Mostrar solo los campos uuid_empresa y nombre_empresa en la vista de lista
    list_display = ('uuid_empresa', 'nombre_empresa')

    # Permitir la búsqueda por nombre de empresa
    search_fields = ('nombre_empresa',)

