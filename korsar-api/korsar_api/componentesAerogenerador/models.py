import uuid
from django.db import models
from aerogeneradores.models import Aerogenerador
from estadoAerogeneradores.models import EstadoAerogenerador
from inspecciones.models import Inspeccion

class ComponenteAerogenerador(models.Model):
    """
    Modelo ComponenteAerogenerador para la base de datos
    """

    # LLave primaria UUID
    uuid_componente = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relación con Aerogenerador usando UUID
    uuid_aerogenerador = models.ForeignKey(Aerogenerador, on_delete=models.CASCADE)

    # Opciones de tipo de componente
    TIPO_COMPONENTE_CHOICES = [
        ('helice_a', 'Hélice A'),
        ('helice_b', 'Hélice B'),
        ('helice_c', 'Hélice C'),
        ('torre', 'Torre'),
        ('nacelle', 'Nacelle/Hub'),
    ]

    # Campos
    tipo_componente = models.CharField(
        max_length=50,
        choices=TIPO_COMPONENTE_CHOICES,
    )

    def existe_componente_para_usuario(uuid_componente, user):
        """
        Verifica si un componente con el UUID dado pertenece a la empresa del usuario.
        """

        return ComponenteAerogenerador.objects.filter(
            uuid_componente=uuid_componente,
            uuid_aerogenerador__uuid_parque_eolico__uuid_empresa=user.uuid_empresa.uuid_empresa).exists()


    def __str__(self):
        return f"Componente {self.get_tipo_componente_display()} del Aerogenerador {self.uuid_aerogenerador}"
