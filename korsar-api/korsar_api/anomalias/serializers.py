from rest_framework import serializers
from .models import Anomalia, Aerogenerador, ComponenteAerogenerador, Inspeccion, Usuario

class AnomaliaSerializer(serializers.ModelSerializer):
    uuid_aerogenerador = serializers.PrimaryKeyRelatedField(
        queryset=Aerogenerador.objects.all()
    )
    uuid_componente = serializers.PrimaryKeyRelatedField(
        queryset=ComponenteAerogenerador.objects.all()
    )
    uuid_inspeccion = serializers.PrimaryKeyRelatedField(
        queryset=Inspeccion.objects.all()
    )
    uuid_tecnico = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = Anomalia
        fields = '__all__'

    # Validación personalizada para uuid_tecnico
    def validate_uuid_tecnico(self, value):
        if value is not None:
            # Verificar que el usuario tenga el tipo de usuario 'Técnico'
            if value.tipo_usuario != 1:  # 1 corresponde a 'Técnico' según tus choices
                raise serializers.ValidationError("El usuario debe tener el rol de técnico.")
        return value

    # Validación personalizada para severidad_anomalia
    def validate_severidad_anomalia(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError("La severidad debe estar entre 1 y 5.")
        return value

    # Validación para descripcion_anomalia (obligatoria)
    def validate_descripcion_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La descripción de la anomalía es obligatoria.")
        return value

    # Validación para dimension_anomalia
    def validate_dimension_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La dimensión de la anomalía es obligatoria.")
        elif len(value) > 255:
            raise serializers.ValidationError("La dimensión no puede exceder los 255 caracteres.")
        return value

    # Validación para orientacion_anomalia
    def validate_orientacion_anomalia(self, value):
        if not value.strip():
            raise serializers.ValidationError("La orientación es obligatoria.")
        elif len(value) > 255:
            raise serializers.ValidationError("La orientación no puede exceder los 255 caracteres.")
        return value
