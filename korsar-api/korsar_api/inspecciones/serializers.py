from rest_framework import serializers
from .models import Inspeccion

class InspeccionSerializer(serializers.ModelSerializer):
    """
    Difinicón del serializador InspeccionSerializer para convertir los objetos Inspeccion en JSON
    """
    class Meta:
        model = Inspeccion
        fields = '__all__'
