from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ImagenAnomalia
from .serializers import ImagenAnomaliaSerializer

class ImagenAnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definición de las operaciones CRUD para las imagenes de anomalias
    """
    queryset = ImagenAnomalia.objects.all()
    serializer_class = ImagenAnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder
