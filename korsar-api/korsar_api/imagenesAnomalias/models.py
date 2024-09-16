import uuid
from django.db import models
from imagenes.models import Imagen
from anomalias.models import Anomalia

class ImagenAnomalia(models.Model):
    """
    Definición de la clase ImagenAnomalia para el modelo de datos de ImagenAnomalia
    """

    # Clave primaria UUID
    uuid_imagen_anomalia = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relaciones ForeignKey usando UUIDs
    uuid_imagen = models.ForeignKey(Imagen, on_delete=models.CASCADE)
    uuid_anomalia = models.ForeignKey(Anomalia, on_delete=models.CASCADE)

    def __str__(self):
        return f"Imagen Anomalía {self.uuid_imagen_anomalia}"
