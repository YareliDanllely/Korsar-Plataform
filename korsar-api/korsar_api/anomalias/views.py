from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from .serializers import AnomaliaSerializer

class AnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definir la vista de AnomaliaViewSet para la API
    """

    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder
