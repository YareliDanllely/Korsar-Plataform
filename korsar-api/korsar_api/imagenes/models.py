import uuid
from django.db import models
from aerogeneradores.models import Aerogenerador
from componentesAerogenerador.models import ComponenteAerogenerador
from inspecciones.models import Inspeccion

class Imagen(models.Model):
    """
    Definir el modelo Imagen para la base de datos
    """

    CLASIFICACION_CHOICES = (
        ('clasificada', 'Clasificada'),
        ('no_clasificada', 'No Clasificada'),
    )


    # Clave Primaria UUID
    uuid_imagen = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relaciones ForeignKey usando UUIDs
    uuid_aerogenerador = models.ForeignKey(Aerogenerador, on_delete=models.CASCADE)
    uuid_componente = models.ForeignKey(ComponenteAerogenerador, on_delete=models.CASCADE)
    uuid_inspeccion = models.ForeignKey(Inspeccion, on_delete=models.CASCADE)


    nombre_imagen = models.CharField(max_length=255)
    fecha_creacion = models.DateField()
    ruta_imagen = models.CharField(max_length=255)
    estado_clasificacion = models.CharField(
        max_length=255,
        choices=CLASIFICACION_CHOICES,
        default='no_clasificada'
    )

    def __str__(self):
        return f"Imagen {self.nombre_imagen} - Inspección {self.uuid_inspeccion}"
