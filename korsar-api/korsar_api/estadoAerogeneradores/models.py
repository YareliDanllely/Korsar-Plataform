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

    SEVERIDAD_CHOICES = [
        (1, 'Sin daño'),
        (2, 'Menor'),
        (3, 'Significativo'),
        (4, 'Mayor'),
        (5, 'Crítico'),
    ]

    estado_final_clasificacion = models.IntegerField(choices=SEVERIDAD_CHOICES, null=True, blank=True)

    def existe_estado_para_usuario(uuid_estado, user):
        """
        Verifica si un estado con el UUID dado pertenece a la empresa del usuario.
        """

        return EstadoAerogenerador.objects.filter(
            uuid_estado=uuid_estado,
            uuid_aerogenerador__uuid_parque_eolico__uuid_empresa=user.uuid_empresa.uuid_empresa).exists()

    def __str__(self):
        return f"Estado {self.estado_final_clasificacion} del Aerogenerador {self.uuid_aerogenerador}"


    class Meta:
        verbose_name = "Estado Aerogenerador"
        verbose_name_plural = "Estados Aerogeneradores"
