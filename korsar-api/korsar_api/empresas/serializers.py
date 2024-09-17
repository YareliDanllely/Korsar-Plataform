from rest_framework import serializers
from .models import Empresa

class EmpresaSerializer(serializers.ModelSerializer):
    """
    Componente para serializar la información de una empresa (transformar informacion de un modelo a JSON)
    """

    class Meta:
        model = Empresa
        fields = '__all__'


