from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import AnomaliaSerializer

class AnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definir la vista de AnomaliaViewSet para la API
    """
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder


#Vista para obtener anomalias recientes por aerogenerador y componente
#Nos permitira asociar imagenes con anomalias ya definidas previamente
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
