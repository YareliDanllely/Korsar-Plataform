from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from .serializers import ComponenteAerogeneradorSerializer

class ComponenteAerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definicion de las operaciones CRUD para los componentes de aerogenerador
    """

    queryset = ComponenteAerogenerador.objects.all()
    serializer_class = ComponenteAerogeneradorSerializer
    permission_classes = [IsAuthenticated]
