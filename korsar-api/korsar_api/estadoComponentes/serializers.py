from rest_framework import serializers
from .models import EstadoComponente

class EstadoComponenteSerializer(serializers.ModelSerializer):
    """
    Definir el serializador EstadoComponenteSerializer para convertir los objetos EstadoComponente en JSON
    """

    class Meta:
        model = EstadoComponente
        fields = '__all__'
