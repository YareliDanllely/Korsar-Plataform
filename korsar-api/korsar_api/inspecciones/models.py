import uuid
from django.db import models
from parquesEolicos.models import ParquesEolicos

class Inspeccion(models.Model):
    """
    Definir el modelo Inspección para la base de datos
    """

    # Clave primaria UUID
    uuid_inspeccion = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ForeignKey usando UUID
    uuid_parque_eolico = models.ForeignKey(ParquesEolicos, on_delete=models.CASCADE)  # Relación con Parque Eólico

    fecha_inspeccion = models.DateField()
    fecha_siguiente_inspeccion = models.DateField(null=True, blank=True)

    # Opciones de progreso
    PROGRESO_OPCIONES = (
        (1, "Completado"),
        (0, "No Completado"),  # Pendiente
    )

    progreso = models.IntegerField(choices=PROGRESO_OPCIONES, default=0)

    def belongs_to_company(self, uuid_company):
        return self.uuid_parque_eolico.uuid_empresa.uuid_empresa == uuid_company

    def __str__(self):
        return f"Inspección {self.uuid_inspeccion} del Parque {self.uuid_parque_eolico.nombre_parque}"

