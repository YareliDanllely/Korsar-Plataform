from rest_framework import serializers
from .models import Anomalia, Aerogenerador, ComponenteAerogenerador, Inspeccion

class AnomaliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anomalia
        fields = '__all__'

    # Validar que el UUID del aerogenerador exista en la base de datos
    def validate_uuid_aerogenerador(self, value):
        if not Aerogenerador.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("El UUID del aerogenerador no existe.")
        return value

    # Validar que el UUID del componente exista en la base de datos
    def validate_uuid_componente(self, value):
        if not ComponenteAerogenerador.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("El UUID del componente no existe.")
        return value

    # Validar que el UUID de la inspección exista en la base de datos
    def validate_uuid_inspeccion(self, value):
        if not Inspeccion.objects.filter(uuid=value).exists():
            raise serializers.ValidationError("El UUID de la inspección no existe.")
        return value

    # Validación personalizada para la severidad de la anomalía
    def validate_severidad_anomalia(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError("La severidad debe estar entre 1 y 5.")
        return value

    # Validación para la descripción (obligatoria)
    def validate_descripcion_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La descripción de la anomalía es obligatoria.")
        return value

    # Validar que la dimensión de la anomalía no esté vacía
    def validate_dimension_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La dimensión de la anomalía es obligatoria.")
        elif len(value) > 255:
            raise serializers.ValidationError("La dimensión no puede exceder los 255 caracteres.")
        return value

    # Validar que la orientación de la anomalía no esté vacía
    def validate_orientacion_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La orientación es obligatoria.")
        elif len(value) > 255:
            raise serializers.ValidationError("La orientación no puede exceder los 255 caracteres.")
        return value
