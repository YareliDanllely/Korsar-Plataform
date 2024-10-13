from rest_framework import serializers
from .models import Inspeccion, ParquesEolicos

class InspeccionSerializer(serializers.ModelSerializer):
    # Ajusta para que apunte al campo correcto del modelo ParqueEolico
    nombre_parque = serializers.CharField(source='uuid_parque_eolico.nombre_parque', read_only=True)

    class Meta:
        model = Inspeccion
        fields = [
            'uuid_inspeccion',
            'fecha_inspeccion',
            'fecha_siguiente_inspeccion',
            'progreso',
            'uuid_parque_eolico',
            'nombre_parque',  # Incluye el nombre del parque aquí
        ]
