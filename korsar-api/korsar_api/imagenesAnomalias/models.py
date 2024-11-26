import uuid
from django.db import models
from imagenes.models import Imagen
from anomalias.models import Anomalia
from utils.mixin import ValidacionAccesoMixin

class ImagenAnomalia(models.Model, ValidacionAccesoMixin):
    """
    Definición de la clase ImagenAnomalia para el modelo de datos de ImagenAnomalia
    """

    # Clave primaria UUID
    uuid_imagen_anomalia = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relaciones ForeignKey usando UUIDs
    uuid_imagen = models.ForeignKey(Imagen, on_delete=models.CASCADE)
    uuid_anomalia = models.ForeignKey(Anomalia, on_delete=models.CASCADE)

    def pertenece_a_empresa(self, uuid_empresa):
        """
        Verifica si la Anomalia pertenece a una empresa específica.

        :param uuid_empresa: UUID de la empresa que se desea verificar.
        :return: True si pertenece a la empresa, False en caso contrario.
        """
        return self.uuid_anomalia.uuid_aerogenerador.uuid_parque_eolico.uuid_empresa.uuid_empresa == uuid_empresa


    def __str__(self):
        return f"Imagen Anomalía {self.uuid_imagen_anomalia}"
