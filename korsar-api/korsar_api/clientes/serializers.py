from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    """
    Componente para serializar la información de un cliente (transformar informacion de un modelo a JSON)
    """

    class Meta:
        model = Cliente
        fields = '__all__'


