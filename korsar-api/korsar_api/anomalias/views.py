from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import AnomaliaSerializer


#Vista para operaciones CRUD de Anomalias
class AnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definir la vista de AnomaliaViewSet para la API
    """
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder


    # Definir consulta para obtener la cantidad de severidad de daños por una inspeccion
    @action(detail=False, methods=['get'], url_path='severidades-por-inspeccion')
    def obtener_severidades_por_inspeccion(self, request):
        """
        Obtener todas las severidades de anomalías asociadas a una inspección en particular.
        """
        uuid_inspeccion = request.query_params.get('uuid_inspeccion')
        if not uuid_inspeccion:
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar anomalías por inspección
        anomalías = Anomalia.objects.filter(uuid_inspeccion=uuid_inspeccion)

        # Extraer las severidades
        severidades = anomalías.values_list('severidad_anomalia', flat=True)

        return Response({'severidades': list(severidades)}, status=status.HTTP_200_OK)


    # *********Definir cantidad de serveridad de daños por componente en una inspeccion***************




# Vista para obtener anomalias definidas por aerogenerador, componente e inspeccion
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
                uuid_aerogenerador=uuid_aerogenerador_url,  # Filtrar por UUID del aerogenerador
                uuid_componente=uuid_componente_url,  # Filtrar por UUID del componente
                uuid_inspeccion=uuid_inspeccion_url  # Filtrar por UUID de la inspección
            )


        else:
            queryset = queryset.none()

        return queryset


