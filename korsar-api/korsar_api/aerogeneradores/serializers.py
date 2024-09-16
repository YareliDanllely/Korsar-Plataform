from rest_framework import serializers
from .models import Aerogenerador

class AerogeneradorSerializer(serializers.ModelSerializer):
    """
    Definir el serializador AerogeneradorSerializer para convertir los objetos Aerogenerador en JSON
    """

    class Meta:
        model = Aerogenerador
        fields = '__all__'
