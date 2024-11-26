import uuid
from django.db import models
from utils.mixin import ValidacionAccesoMixin
from inspecciones.models import Inspeccion

class EstadoAerogenerador(models.Model, ValidacionAccesoMixin):
    """
    Modelo de la tabla EstadoAerogeneradores
    """

    # Llave Primaria UUID
    uuid_estado = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ForeignKeys usando UUID
    uuid_aerogenerador = models.ForeignKey('aerogeneradores.Aerogenerador', on_delete=models.CASCADE)
    uuid_inspeccion = models.ForeignKey(Inspeccion, on_delete=models.CASCADE)

    SEVERIDAD_CHOICES = [
        (1, 'Sin daño'),
        (2, 'Menor'),
        (3, 'Significativo'),
        (4, 'Mayor'),
        (5, 'Crítico'),
    ]

    estado_final_clasificacion = models.IntegerField(choices=SEVERIDAD_CHOICES, null=True, blank=True)

    def pertenece_a_empresa(self, uuid_empresa):
        """
        Verifica si la Anomalia pertenece a una empresa específica.

        :param uuid_empresa: UUID de la empresa que se desea verificar.
        :return: True si pertenece a la empresa, False en caso contrario.
        """
        return self.uuid_aerogenerador.uuid_parque_eolico.uuid_empresa.uuid_empresa == uuid_empresa


    def __str__(self):
        return f"Estado {self.estado_final_clasificacion} del Aerogenerador {self.uuid_aerogenerador}"
