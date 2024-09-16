from rest_framework import serializers
from .models import ImagenAnomalia

class ImagenAnomaliaSerializer(serializers.ModelSerializer):
    """
    Definición del serializador ImagenAnomaliaSerializer para convertir los objetos ImagenAnomalia en JSON
    """

    class Meta:
        model = ImagenAnomalia
        fields = '__all__'
