from rest_framework import serializers
from .models import ParqueEolico

class ParqueEolicoSerializer(serializers.ModelSerializer):

    """
    Componente para serializar la información de un cliente (transformar informacion de un modelo a JSON)
    """

    class Meta:
        model = ParqueEolico
        fields = ['id', 'nombre_parque', 'ubicacion_comuna', 'ubicacion_region', 'cantidad_turbinas', 'potencia_instalada', 'coordenada_longitud', 'coordenada_latitud']
