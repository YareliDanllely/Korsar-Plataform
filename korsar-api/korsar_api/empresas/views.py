from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Empresa
from rest_framework.response import Response
from .serializers import EmpresaSerializer
from rest_framework.decorators import action
from rest_framework import status
from parquesEolicos.serializers import ParqueEolicoSerializer



class EmpresaViewSet(viewsets.ModelViewSet): # ModelViset es una clase de Django que permite realizar operaciones CRUD sobre un modelo
    """
    Definimos las acciones que se pueden realizar en el API para la entidad empresa
    """
    queryset = Empresa.objects.all() # Se opera sobre toda la tabla de clientes
    serializer_class = EmpresaSerializer # Se utiliza el serializador de clientes
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    # Obtener todas los parques asociado a una empresa
    @action(detail=True, methods=['get'], url_path='parques')
    def get_parques_de_empresa(self, request, pk=None):
        """
        Obtenemos toda la información de los parques asociados a una empresa en particular.
        """
        # Obtenemos la empresa correspondiente usando el PK
        empresa = self.get_object()

        # Obtenemos los parques asociados a esta empresa
        parques_eolicos = empresa.parques.all()  # Acceso a la relación de parques

        # Serializamos los parques para devolverlos como JSON
        serializer = ParqueEolicoSerializer(parques_eolicos, many=True)

        # Retornamos la lista de parques en el formato JSON
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Obtener informacion de una empresa por su uuid
    @action(detail=False, methods=['get'], url_path='empresa_por_uuid')
    def get_empresa_por_uuid(self, request):
        """
        Obtenemos toda la información de una empresa en particular, dado su uuid.
        """
        # Obtenemos el uuid de la empresa
        uuid_empresa = request.query_params.get('uuid_empresa')

        # Obtenemos la empresa correspondiente usando el uuid
        empresa = Empresa.objects.get(uuid_empresa=uuid_empresa)

        # Serializamos la empresa para devolverla como JSON
        serializer = EmpresaSerializer(empresa)

        # Retornamos la empresa en el formato JSON
        return Response(serializer.data, status=status.HTTP_200_OK)






