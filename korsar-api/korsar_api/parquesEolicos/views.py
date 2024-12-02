from rest_framework.decorators import action
from rest_framework import viewsets
from .models import ParquesEolicos
from .serializers import ParqueEolicoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from usuarios.models import Usuario

from rest_framework import status
from utils.validarAcceso import ValidarAcceso
from rest_framework.decorators import action
from rest_framework import viewsets
from .models import ParquesEolicos
from .serializers import ParqueEolicoSerializer
from utils.utils import is_valid_uuid
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class ParqueEolicoViewSet(viewsets.ModelViewSet):
    """
    API para manejar parques eólicos con lógica específica para técnicos y clientes.
    """
    queryset = ParquesEolicos.objects.all()  # Asegúrate de definir el queryset
    serializer_class = ParqueEolicoSerializer
    permission_classes = [IsAuthenticated]

#-----------------------------------------------------------------------------------------#

    @action(detail=True, methods=['get'], url_path='parques-por-empresa')
    def obtener_parques_por_empresa(self, request, pk=None):
        """
        Devuelve los parques eólicos asociados a una empresa seleccionada.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:

            # Validar el pk y el acceso del usuario al recurso
            validador.validar_recurso(pk, Usuario.usuario_esta_asociado_a_empresa)

            print("Obteniendo parques por empresa")
            parques =  ParquesEolicos.objects.filter(uuid_empresa=pk)
            serializer = ParqueEolicoSerializer(parques, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (ParquesEolicos.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#-----------------------------------------------------------------------------------------#

    @action(detail=True, methods=['get'], url_path='abreviatura-por-id')
    def obtener_abreviatura_por_id(self, request, pk=None):
        """
        Devuelve la abreviatura de un parque dado su UUID.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar el acceso del usuario al recurso
            validador.validar_recurso(pk, ParquesEolicos.existe_parque_para_usuario)
            parque = ParquesEolicos.objects.get(uuid_parque_eolico=pk)
            return Response({'abreviatura_parque': parque.abreviatura_parque}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (ParquesEolicos.DoesNotExist, ValueError) as e:
            return Response({'error': 'Parque eólico no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

