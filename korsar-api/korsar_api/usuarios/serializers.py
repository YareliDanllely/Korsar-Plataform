from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Clase que serializa la información de un usuario
    """
    class Meta:
        model = Usuario
        fields = '__all__'

