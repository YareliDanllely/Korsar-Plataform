from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cliente
from .serializers import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet): # ModelViset es una clase de Django que permite realizar operaciones CRUD sobre un modelo
    """
    Definimos las acciones que se pueden realizar en el API para la entidad Cliente
    """
    queryset = Cliente.objects.all() # Se opera sobre toda la tabla de clientes
    serializer_class = ClienteSerializer # Se utiliza el serializador de clientes
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder
