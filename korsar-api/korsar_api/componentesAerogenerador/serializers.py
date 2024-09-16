from rest_framework import serializers
from .models import ComponenteAerogenerador

class ComponenteAerogeneradorSerializer(serializers.ModelSerializer):
    """
    Definir el serializador ComponenteAerogeneradorSerializer para convertir los objetos ComponenteAerogenerador en JSON
    """

    class Meta:
        model = ComponenteAerogenerador
        fields = '__all__'
