
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EstadoAerogeneradores
from .serializers import EstadoAerogeneradoresSerializer

class EstadoAerogeneradoresViewSet(viewsets.ModelViewSet):
    """
    Definimos operaciones  que se pueden realizar en el API para la entidad EstadoAerogeneradores
    """

    queryset = EstadoAerogeneradores.objects.all()
    serializer_class = EstadoAerogeneradoresSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder
