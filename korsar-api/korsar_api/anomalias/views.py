from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import AnomaliaSerializer
import re

# Vista para operaciones CRUD de Anomalias
class AnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definir la vista de AnomaliaViewSet para la API
    """
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    # Definir consulta para obtener la cantidad de severidad de daños por una inspección
class AnomaliaViewSet(viewsets.ModelViewSet):
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]

    # Definir consulta para obtener la cantidad de severidad de daños por una inspección
    @action(detail=False, methods=['get'], url_path='severidades-por-inspeccion')
    def obtener_severidades_por_inspeccion(self, request):
        uuid_inspeccion = request.query_params.get('uuid_inspeccion')
        if not uuid_inspeccion:
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        anomalias = Anomalia.objects.filter(uuid_inspeccion=uuid_inspeccion)
        severidades = anomalias.values_list('severidad_anomalia', flat=True)
        return Response({'severidades': list(severidades)}, status=status.HTTP_200_OK)


    # Definir consulta para obtener la cantidad de severidad de daños por componente
    @action(detail=False, methods=['get'], url_path='severidades-por-componente')
    def obtener_severidades_por_componente(self, request):
        uuid_inspeccion = request.query_params.get('uuid_inspeccion')
        if not uuid_inspeccion:
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        resultados = (
            Anomalia.objects.filter(uuid_inspeccion=uuid_inspeccion)
            .values('uuid_componente__tipo_componente', 'severidad_anomalia')
            .annotate(cantidad=Count('severidad_anomalia'))
        )
        return Response({'resultados': list(resultados)}, status=status.HTTP_200_OK)


    # Definir consulta para obtener el siguiente número de daño
    @action(detail=False, methods=['get'], url_path='siguiente-numero-dano')
    def obtener_siguiente_numero_damage(self, request):
        uuid_componente = request.query_params.get('uuid_componente')
        if not uuid_componente:
            return Response({'error': 'uuid_componente es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar anomalías por uuid_componente
        anomalias = Anomalia.objects.filter(codigo_anomalia__contains=uuid_componente)

        # Lista para almacenar números de daño
        numero_damage = []

        for anomalia in anomalias:
            # Usar expresión regular para extraer el número de daño
            match = re.search(r'-\d{4}-(\d+)-', anomalia.codigo_anomalia)
            if match:
                numero_damage.append(int(match.group(1)))  # Agregar el número de daño a la lista

        # Calcular el siguiente número de daño
        siguiente_numero_dano = (max(numero_damage) + 1) if numero_damage else 1

        return Response({'siguiente_numero_dano': f"{siguiente_numero_dano:04d}"}, status=status.HTTP_200_OK)

# Vista para obtener anomalías definidas por aerogenerador, componente e inspección
class AnomaliaListView(generics.ListAPIView):
    """
    Vista que permite filtrar las anomalías por aerogenerador, componente e inspección.
    """
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Anomalia.objects.all()

        uuid_aerogenerador_url = self.request.query_params.get('turbina')
        uuid_componente_url = self.request.query_params.get('componente')
        uuid_inspeccion_url = self.request.query_params.get('inspeccion')

        if uuid_aerogenerador_url and uuid_componente_url and uuid_inspeccion_url:
            queryset = queryset.filter(
                uuid_aerogenerador=uuid_aerogenerador_url,
                uuid_componente=uuid_componente_url,
                uuid_inspeccion=uuid_inspeccion_url
            )
        else:
            queryset = queryset.none()

        return queryset
