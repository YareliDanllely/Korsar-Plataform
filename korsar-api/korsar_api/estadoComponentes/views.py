from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EstadoComponente
from .serializers import EstadoComponenteSerializer

class EstadoComponenteViewSet(viewsets.ModelViewSet):
    """
    Definir la vista de EstadoComponenteViewSet para la API
    """

    queryset = EstadoComponente.objects.all()
    serializer_class = EstadoComponenteSerializer
    permission_classes = [IsAuthenticated]


