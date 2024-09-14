from django.db import models


# Clase ParqueEolico que repesenta los parques eólicos en la base de datos
class ParqueEolico(models.Model):
    """
    Definición de los componentes asociados a un Parque Eólico
    """


    nombre_parque = models.CharField(max_length=255)
    ubicacion_comuna = models.CharField(max_length=255)
    ubicacion_region = models.CharField(max_length=255)
    cantidad_turbinas = models.IntegerField()
    potencia_instalada = models.FloatField()
    coordenada_longitud = models.FloatField()
    coordenada_latitud = models.FloatField()

    def __str__(self):
        return self.nombre_parque
