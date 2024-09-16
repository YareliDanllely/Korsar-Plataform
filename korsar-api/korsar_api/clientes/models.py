import uuid
from django.db import models
from usuarios.models import Usuario
from parquesEolicos.models import ParquesEolicos

class Cliente(models.Model):
    """
    Definición del modelo Cliente asociado a Parques Eólicos.
    """
    # LLave primaria UUID
    uuid_cliente = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relación con Parque Eólico y Usuario usando claves UUID
    uuid_parque_eolico = models.ForeignKey(ParquesEolicos, on_delete=models.CASCADE)
    uuid_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cliente {self.uuid_usuario.username} - Parque Eólico {self.uuid_parque_eolico.nombre_parque}"
