from django.db import models
import uuid


class Aerogenerador(models.Model):
    """
    Modelo Aerogenerador usando UUID como clave primaria.
    """

    # Llave primaria UUID
    uuid_aerogenerador = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relación con el parque eólico
    uuid_parque_eolico = models.ForeignKey('parquesEolicos.ParquesEolicos', on_delete=models.CASCADE)

    # Campos
    numero_aerogenerador = models.IntegerField()
    modelo_aerogenerador = models.CharField(max_length=255)
    fabricante_aerogenerador = models.CharField(max_length=255)
    altura_aerogenerador = models.FloatField()
    diametro_rotor = models.FloatField()
    potencia_nominal = models.FloatField()
    coordenada_longitud = models.FloatField()
    coordenada_latitud = models.FloatField()


    def __str__(self):
        return f"Aerogenerador {self.numero_aerogenerador} - {self.modelo_aerogenerador}"
