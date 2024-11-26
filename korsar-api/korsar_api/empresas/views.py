from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Empresa
from rest_framework.response import Response
from .serializers import EmpresaSerializer
from rest_framework.decorators import action
from rest_framework import status
from usuarios.models import Usuario
from utils.utils import is_valid_uuid
from parquesEolicos.serializers import ParqueEolicoSerializer


class EmpresaViewSet(viewsets.ModelViewSet):
    """
    Definimos las acciones que se pueden realizar en el API para la entidad empresa.
    """
    queryset = Empresa.objects.all()  # Se opera sobre toda la tabla de empresas
    serializer_class = EmpresaSerializer  # Se utiliza el serializador de empresas
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

#--------------------------------------------------------------------#

    # Obtener todos los parques asociados a una empresa
    @action(detail=True, methods=['get'], url_path='parques')
    def get_parques_de_empresa(self, request, pk=None):
        """
        Obtenemos toda la información de los parques asociados a una empresa en particular.
        """
        try:


            # Obtenemos la empresa correspondiente usando el PK
            empresa = self.get_object()

            # Obtenemos los parques asociados a esta empresa
            parques_eolicos = empresa.parques.all()  # Acceso a la relación de parques

            # Serializamos los parques para devolverlos como JSON
            serializer = ParqueEolicoSerializer(parques_eolicos, many=True)

            # Retornamos la lista de parques en el formato JSON
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Empresa.DoesNotExist:
            return Response({'error': 'Empresa no encontrada'}, status=status.HTTP_404_NOT_FOUND)


#--------------------------------------------------------------------#


    # Obtener información de una empresa por su UUID
    @action(detail=False, methods=['get'], url_path='empresa-por-uuid')
    def get_empresa_por_uuid(self, request):
        """
        Obtenemos toda la información de una empresa en particular, dado su UUID.
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener y validar el parámetro uuid_empresa
        uuid_empresa = request.query_params.get('uuid_empresa')

        if not uuid_empresa or not is_valid_uuid(uuid_empresa):
            return Response({'error': 'El parámetro uuid_empresa es requerido y debe ser válido'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar acceso del usuario si es cliente
            if user.is_cliente:
                if not Usuario.objects.filter(
                    uuid_usuario=user.uuid_usuario,
                    uuid_empresa__uuid_empresa=uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a la empresa solicitada'},
                                    status=status.HTTP_403_FORBIDDEN)

            # Obtener la empresa correspondiente usando el UUID
            empresa = Empresa.objects.get(uuid_empresa=uuid_empresa)

            # Serializamos la empresa para devolverla como JSON
            serializer = EmpresaSerializer(empresa)

            # Retornamos la empresa en el formato JSON
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Empresa.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
         return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#--------------------------------------------------------------------#

    # Obtener todas las empresas
    @action(detail=False, methods=['get'], url_path='todas-las-empresas')
    def get_todas_las_empresas(self, request):
        """
        Devuelve una lista con todas las empresas disponibles.
        """
        try:
            # Obtenemos todas las empresas
            empresas = Empresa.objects.all()

            # Serializamos la lista de empresas
            serializer = self.get_serializer(empresas, many=True)

            # Retornamos la lista en formato JSON
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error al obtener las empresas: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
