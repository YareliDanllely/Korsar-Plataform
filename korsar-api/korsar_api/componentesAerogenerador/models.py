import uuid
from django.db import models
from aerogeneradores.models import Aerogenerador
from estadoAerogeneradores.models import EstadoAerogenerador

class ComponenteAerogenerador(models.Model):
    """
    Definir el modelo ComponenteAerogenerador para la base de datos
    """

    # LLave primaria UUID
    uuid_componente = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relación con Aerogenerador y EstadoAerogenerador usando UUID
    uuid_aerogenerador = models.ForeignKey(Aerogenerador, on_delete=models.CASCADE)
    uuid_ultimo_estado = models.ForeignKey(EstadoAerogenerador, on_delete=models.CASCADE, null=True, blank=True)  # Permitir nulos  # Relación con Estado Aerogenerador

    # Campos
    tipo_componente = models.CharField(max_length=255)
    coordenada_longitud = models.FloatField()
    coordenada_latitud = models.FloatField()
    ruta_imagen_visualizacion_componente = models.CharField(max_length=255)


    def __str__(self):
        return f"Componente {self.tipo_componente} del Aerogenerador {self.uuid_aerogenerador}"
