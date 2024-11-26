from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from aerogeneradores.models import Aerogenerador
from utils.utils import is_valid_uuid



class ComponenteAerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = ComponenteAerogenerador.objects.all()
    serializer_class = ComponenteAerogenerador
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

 #----------------------------------------------------------------------------------------------------------#

    # OBTENER EL TIPO DE COMPONENTE
    @action(detail=False, methods=['get'], url_path='tipo-componente')
    def tipo_componente(self,request):
        """
        Obtiene el tipo del componente en base a su identificador unico
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener parámetros de la URL
        uuid_componente_url = request.query_params.get('uuid_componente')

        # Validar que los parámetros no sean nulos
        if not uuid_componente_url or not is_valid_uuid(uuid_componente_url):
            return Response({'error': 'Parámetro uuid_componente es requerido y debe ser valido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar acceso del usuario al aerogenerador
            if user.is_cliente:
                if not ComponenteAerogenerador.objects.filter(
                    uuid_componente=uuid_componente_url,
                    uuid_aerogenerador__uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa_uuid_empresa
                    ).exists():
                    return Response({'error': 'No tiene acceso a este componente'}, status=status.HTTP_403_FORBIDDEN)


            componente = ComponenteAerogenerador.objects.filter(uuid_componente=uuid_componente_url).first()

            if componente:
                return Response({'tipo_componente': componente.tipo_componente}, status=status.HTTP_200_OK)

         # Manejo de excepciones
        except (ComponenteAerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#----------------------------------------------------------------------------------------------------------#

    # Obtener todos los componentes de un aerogenerador
    @action(detail=False, methods=['get'], url_path='componentes-por-aerogenerador')
    def componentes_por_aerogenerador(self, request):
        """
        Listar todos los componentes de un aerogenerador
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener los parámetros de la URL
        uuid_aerogenerador_url = request.query_params.get('uuid_aerogenerador')

        # Validar que los parámetros no sean nulos
        if not uuid_aerogenerador_url or not is_valid_uuid(uuid_aerogenerador_url):
            return Response({'error': 'El parámetro uuid_aerogenerador es requerido y debe ser válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar acceso del usuario al aerogenerador
            if user.is_cliente:
                  if not Aerogenerador.objects.filter(
                    uuid_aerogenerador=uuid_aerogenerador_url,
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa

                ).exists():
                    return Response({'error': 'No tiene acceso a este aerogenerador'}, status=status.HTTP_403_FORBIDDEN)

            # Filtrar los componentes por aerogenerador
            componentes = ComponenteAerogenerador.objects.filter(uuid_aerogenerador=uuid_aerogenerador_url)

            componentes_list = []
            for componente in componentes:
                componentes_list.append({
                    'uuid_componente': str(componente.uuid_componente),  # Convertir UUID a cadena
                    'tipo_componente': componente.tipo_componente
                })

            return Response(componentes_list, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Aerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

