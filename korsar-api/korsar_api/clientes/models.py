from django.db import models
from usuarios.models import Usuario
from parquesEolicos.models import ParqueEolico

class Cliente(models.Model):
    """
    Definición de los componentes asociados a un Cliente
    """
    id_cliente = models.AutoField(primary_key=True)
    id_parque_eolico = models.ForeignKey(ParqueEolico, on_delete=models.CASCADE)  # Relación con Parque Eólico
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Relación con Usuario

    def __str__(self):
        return f"Cliente {self.id_usuario.username} - Parque Eólico {self.id_parque_eolico.nombre_parque}"
