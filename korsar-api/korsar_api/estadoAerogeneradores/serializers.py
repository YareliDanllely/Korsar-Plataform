from rest_framework import serializers
from .models import EstadoAerogeneradores

class EstadoAerogeneradoresSerializer(serializers.ModelSerializer):
    """
    Componente para serializar la información de un EstadoAerogenerador (transformar informacion de un modelo a JSON)
    """

    class Meta:
        model = EstadoAerogeneradores
        fields = '__all__'
