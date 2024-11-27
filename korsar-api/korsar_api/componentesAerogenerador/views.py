from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from aerogeneradores.models import Aerogenerador
from utils.utils import is_valid_uuid
from rest_framework.exceptions import ValidationError
from utils.validarAcceso import ValidarAcceso


class ComponenteAerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = ComponenteAerogenerador.objects.all()
    serializer_class = ComponenteAerogenerador
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

 #----------------------------------------------------------------------------------------------------------#


    # OBTENER EL TIPO DE COMPONENTE
    @action(detail=True, methods=['get'], url_path='tipo-componente')
    def tipo_componente(self, request, pk=None):
        """
        Obtiene el tipo del componente en base a su identificador único.
        """
        validador = ValidarAcceso(request.user)
        try:
            # Validar pk del componente
            validador.validar_pk(
                pk=pk,
                metodo_validacion=ComponenteAerogenerador.existe_componente_para_usuario
            )

            # Obtener componente
            componente = ComponenteAerogenerador.objects.get(pk=pk)
            return Response({'tipo_componente': componente.tipo_componente}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (ComponenteAerogenerador.DoesNotExist, ValueError) as e:
              return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#----------------------------------------------------------------------------------------------------------#

    # OBTENER TODOS LOS COMPONENTES DE UN AEROGENERADOR
    @action(detail=False, methods=['get'], url_path='componentes-por-aerogenerador')
    def componentes_por_aerogenerador(self, request):
        """
        Listar todos los componentes de un aerogenerador.
        params: uuid_aerogenerador
        """
        validador = ValidarAcceso(request.user)
        try:
            parametros = validador.validar_query_params(
                parametros={'uuid_aerogenerador': True},
                request_data=request.query_params,
                validaciones_por_parametro={
                    'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario
                }
            )

            # Filtrar los componentes por aerogenerador
            componentes = ComponenteAerogenerador.objects.filter(uuid_aerogenerador=parametros['uuid_aerogenerador'])


            componentes_list = []
            for componente in componentes:
                componentes_list.append({
                    'uuid_componente': str(componente.uuid_componente),  # Convertir UUID a cadena
                    'tipo_componente': componente.tipo_componente
                })

            return Response(componentes_list, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (ComponenteAerogenerador.DoesNotExist, ValueError) as e:
              return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


