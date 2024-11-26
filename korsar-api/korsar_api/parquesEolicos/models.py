import uuid
from django.db import models
from empresas.models import Empresa
from utils.mixin import ValidacionAccesoMixin

class ParquesEolicos(models.Model, ValidacionAccesoMixin):
    """
    Modelo que representa los parques eólicos.
    """

    # Clave primaria UUID
    uuid_parque_eolico = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Campos obligatorios
    nombre_parque = models.CharField(max_length=255, null=False, blank=False)
    abreviatura_parque = models.CharField(max_length=255, null=False, blank=False)
    ubicacion_comuna = models.CharField(max_length=255)
    ubicacion_region = models.CharField(max_length=255)
    cantidad_turbinas = models.IntegerField()
    potencia_instalada = models.FloatField()
    coordenada_longitud = models.FloatField()
    coordenada_latitud = models.FloatField()

    # Relación con Empresa: Un parque está asociado a una empresa
    uuid_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='parques')

    def pertenece_a_empresa(self, uuid_empresa):
        """
        Verifica si la Anomalia pertenece a una empresa específica.

        :param uuid_empresa: UUID de la empresa que se desea verificar.
        :return: True si pertenece a la empresa, False en caso contrario.
        """
        return self.uuid_empresa.uuid_empresa == uuid_empresa



    def __str__(self):
        return self.nombre_parque
