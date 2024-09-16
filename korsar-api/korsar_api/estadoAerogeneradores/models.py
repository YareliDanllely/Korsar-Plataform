import uuid
from django.db import models

from inspecciones.models import Inspeccion

class EstadoAerogenerador(models.Model):
    """
    Modelo de la tabla EstadoAerogeneradores
    """

    # Llave Primaria UUID
    uuid_estado = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ForeignKeys usando UUID
    uuid_aerogenerador = models.ForeignKey('aerogeneradores.Aerogenerador', on_delete=models.CASCADE)
    uuid_inspeccion = models.ForeignKey(Inspeccion, on_delete=models.CASCADE)

    estado_final_clasificacion = models.CharField(max_length=255, null=True, blank=True)
    progreso = models.CharField(max_length=255)

    def __str__(self):
        return f"Estado {self.estado_final_clasificacion} del Aerogenerador {self.uuid_aerogenerador}"
