import uuid
from django.db import models


class Empresa(models.Model):
    """
    Definición del modelo empresa.
    """
    # LLave primaria UUID
    uuid_empresa = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre_empresa = models.CharField(max_length=255)


    def __str__(self):
        return f"Empresa {self.nombre_empresa} - Parque Eólico {self.uuid_parque_eolico.nombre_parque}"
