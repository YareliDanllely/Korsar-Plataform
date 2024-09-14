from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    """
    Definición los campos que se mostrarán en el panel de administración
    """
    list_display = ('id_cliente', 'id_parque_eolico', 'id_usuario')
    search_fields = ('id_usuario__username', 'id_parque_eolico__nombre_parque')
    list_filter = ('id_parque_eolico',)
