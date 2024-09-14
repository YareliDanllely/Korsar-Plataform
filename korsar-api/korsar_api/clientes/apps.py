from django.apps import AppConfig


class ClientesConfig(AppConfig):
    """
    Configuracion de la aplicación clientes
    """
    default_auto_field = 'django.db.models.BigAutoField' # Campo autoincremental
    name = 'clientes' # Nombre de la aplicación
