import uuid
from django.db import models
from aerogeneradores.models import Aerogenerador
from componentesAerogenerador.models import ComponenteAerogenerador
from inspecciones.models import Inspeccion
from usuarios.models import Usuario

class Anomalia(models.Model):
    """
    Modelo Anomalía actualizado con UUID como clave primaria.
    """

    # Cambiamos el campo de clave primaria a UUID
    uuid_anomalia = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relación con otros modelos
    uuid_aerogenerador = models.ForeignKey(Aerogenerador, on_delete=models.CASCADE)
    uuid_componente = models.ForeignKey(ComponenteAerogenerador, on_delete=models.CASCADE)
    uuid_inspeccion = models.ForeignKey(Inspeccion, on_delete=models.CASCADE)
    uuid_tecnico = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)

    # Campos
    codigo_anomalia = models.CharField(max_length=100)

    # Categorías de severidad
    SEVERIDAD_CHOICES = [
        (1, 'Sin daño'),       # Sin daño
        (2, 'Menor'),          # Menor
        (3, 'Significativo'),  # Significativo
        (4, 'Mayor'),          # Mayor
        (5, 'Crítico'),        # Crítico
    ]
    severidad_anomalia = models.IntegerField(choices=SEVERIDAD_CHOICES)

    dimension_anomalia = models.CharField(max_length=255)
    orientacion_anomalia = models.CharField(max_length=255)
    descripcion_anomalia = models.TextField(blank=True, null=True)
    observacion_anomalia = models.TextField(blank=True, null=True)
    coordenada_x = models.FloatField()
    coordenada_y = models.FloatField()


    def __str__(self):
        return f"Anomalía {self.codigo_anomalia} - Severidad {self.severidad_anomalia}"

    class Meta:
        verbose_name = "Anomalía"
        verbose_name_plural = "Anomalías"
