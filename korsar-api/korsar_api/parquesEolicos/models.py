import uuid
from django.db import models

class ParquesEolicos(models.Model):
    """
    Modelo que representa los parques eólicos.
    """

    # Clave primaria UUID
    uuid_parque = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Campos obligatorios
    nombre_parque = models.CharField(max_length=255, null=False, blank=False)
    ubicacion_comuna = models.CharField(max_length=255)
    ubicacion_region = models.CharField(max_length=255)
    cantidad_turbinas = models.IntegerField()
    potencia_instalada = models.FloatField()
    coordenada_longitud = models.FloatField()
    coordenada_latitud = models.FloatField()

    def __str__(self):
        return self.nombre_parque