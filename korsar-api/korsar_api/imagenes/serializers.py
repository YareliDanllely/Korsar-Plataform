from rest_framework import serializers
from .models import Imagen

class ImagenSerializer(serializers.ModelSerializer):
    """
    Definir el serializador ImagenSerializer para convertir los objetos Imagen en JSON
    """
    class Meta:
        model = Imagen
        fields = '__all__'
