import uuid
from django.db import models
from usuarios.models import Usuario

class Empresa(models.Model):
    """
    Definición del modelo empresa con UUID como clave primaria.
    """
    uuid_empresa = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre_empresa = models.CharField(max_length=255)

    def usuario_tiene_acceso(self, user_uuid):
        """
        Verifica si el usuario con el UUID proporcionado tiene acceso a esta empresa.
        """
        return Usuario.objects.filter(uuid_empresa=self, uuid_usuario=user_uuid).exists()

    def __str___(self):
        return f"Empresa {self.nombre_empresa}"
