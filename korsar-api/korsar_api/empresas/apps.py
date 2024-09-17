from django.apps import AppConfig


class EmpresasConfig(AppConfig):
    """
    Configuracion de la aplicación empresas
    """
    default_auto_field = 'django.db.models.BigAutoField' # Campo autoincremental
    name = 'empresas' # Nombre de la aplicación
