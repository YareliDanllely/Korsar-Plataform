from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inspeccion
from .serializers import InspeccionSerializer

class InspeccionViewSet(viewsets.ModelViewSet):
    """
    Definición de las operaciones CRUD para las inspecciones
    """

    queryset = Inspeccion.objects.all()
    serializer_class = InspeccionSerializer
    permission_classes = [IsAuthenticated]
