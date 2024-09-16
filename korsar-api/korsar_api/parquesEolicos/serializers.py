from rest_framework import serializers
from .models import ParquesEolicos

class ParqueEolicoSerializer(serializers.ModelSerializer):
    """
    Componente para serializar la información de un ParqueEolico (transformar informacion de un modelo a JSON)
    """

    class Meta:
        model = ParquesEolicos
        fields = '__all__'
