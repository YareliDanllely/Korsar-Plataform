import uuid
from django.db import models
from componentesAerogenerador.models import ComponenteAerogenerador
from inspecciones.models import Inspeccion

class EstadoComponente(models.Model):
    """
    Definir el modelo EstadoComponente para la base de datos
    """

    # Usar UUIDField como clave primaria
    uuid_estado = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ForeignKeys usando UUIDs
    uuid_componente = models.ForeignKey(ComponenteAerogenerador, on_delete=models.CASCADE)  # Relación con Componente Aerogenerador
    uuid_inspeccion = models.ForeignKey(Inspeccion, on_delete=models.CASCADE)  # Relación con Inspección

    estado_final_clasificacion = models.CharField(max_length=255, null=True, blank=True)
    progreso = models.CharField(max_length=255)

    def __str__(self):
        return f"Estado {self.estado_final_clasificacion} del Componente {self.uuid_componente}"
