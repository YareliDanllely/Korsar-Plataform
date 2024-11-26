from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Aerogenerador
from parquesEolicos.models import ParquesEolicos
from inspecciones.models import Inspeccion
from utils.utils import is_valid_uuid
from .serializers import AerogeneradorSerializer
from estadoAerogeneradores.models import EstadoAerogenerador


class AerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = Aerogenerador.objects.all()
    serializer_class = AerogeneradorSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder


 #----------------------------------------------------------------------------------------------------------#

    # OBTENER LISTADO DE TODOS LOS AEROGENERADORES CON SU ESTADO FINAL
    @action(detail=False, methods=['get'], url_path='estado-por-inspeccion')
    def listar_por_parque_inspeccion(self, request):
        """
        Listar todos los aerogeneradores con su estado final, por parque e inspección en específico.
        params:
            uuid_parque_eolico (str): UUID del parque eólico
            uuid_inspeccion (str): UUID de la inspección

        return:
            list: Lista de diccionarios con la información de los aerogeneradores y su estado final
            [
                {
                    "uuid_aerogenerador": <str>,
                    "numero_aerogenerador": <int>,
                    "estado_final": <str>,
                    "coordenada_latitud": <float>
                },
                ...
            ]

        """
        # Obtener usuario autenticado
        user = request.user

        parametros = {
            'uuid_parque_eolico': request.query_params.get('uuid_parque_eolico'),
            'uuid_inspeccion': request.query_params.get('uuid_inspeccion')
        }

        # Validar que los parámetros no sean nulos y que sean UUID válidos
        for nombre, valor in parametros.items():
            if not valor:
                return Response({'error': f'El parámetro {nombre} es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            if not is_valid_uuid(valor):
                return Response({'error': f'El parámetro {nombre} no es válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar acceso del usuario al parque e inspección
            if user.is_cliente:
                if not ParquesEolicos.objects.filter(
                    uuid_parque_eolico=parametros['uuid_parque_eolico'],
                    uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    raise PermissionError('No tiene acceso al parque solicitado')

                if not Inspeccion.objects.filter(
                    uuid_inspeccion=parametros['uuid_inspeccion'],
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    raise PermissionError('No tiene acceso a la inspección solicitada')

            # Filtrar los aerogeneradores por parque
            aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=parametros['uuid_parque_eolico'])

            # Filtrar el estado final de los aerogeneradores por inspección
            aerogeneradores_con_estado = []
            for aerogenerador in aerogeneradores:

                estado_final = EstadoAerogenerador.objects.get(
                    uuid_aerogenerador=aerogenerador.uuid_aerogenerador,
                    uuid_inspeccion=parametros['uuid_parque_eolico']
                )
                aerogeneradores_con_estado.append({
                    'uuid_aerogenerador': aerogenerador.uuid_aerogenerador,
                    'numero_aerogenerador': aerogenerador.numero_aerogenerador,
                    'estado_final': estado_final.estado_final_clasificacion,
                    'coordenada_latitud': aerogenerador.coordenada_latitud,
                    'coordenada_longitud': aerogenerador.coordenada_longitud
                })


            return Response(aerogeneradores_con_estado, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (EstadoAerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
         return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





 #----------------------------------------------------------------------------------------------------------#

    # OBTENER NUMERO DE AEROGENERADOR
    @action(detail=False, methods=['get'], url_path='numero-aerogenerador')
    def obtener_numero_aerogenerador(self, request):
        """
        Obtener el número de un aerogenerador basado en su UUID.
        params: uuid_aerogenerador
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
                # Verificar que el aerogenerador pertenece a la empresa del cliente
                if not Aerogenerador.objects.filter(
                    uuid_aerogenerador=uuid_aerogenerador_url,
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa

                ).exists():
                    return Response({'error': 'No tiene acceso a este aerogenerador'}, status=status.HTTP_403_FORBIDDEN)

            # Obtener el número del aerogenerador
            aerogenerador = Aerogenerador.objects.get(pk=uuid_aerogenerador_url)
            return Response({'numero_aerogenerador': aerogenerador.numero_aerogenerador}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Aerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


 #----------------------------------------------------------------------------------------------------------#

    @action(detail=False, methods=['get'], url_path='estado-final')
    def obtener_estado_final_aerogenerador(self, request):
        """
        Obtener el estado final de clasificacion de un aerogenerador por inspeccion y aerogenerador
        params: uuid_aerogenerador, uuid_inspeccion
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener y validar los parámetros de la URL
        parametros = {
            'uuid_aerogenerador': request.query_params.get('uuid_aerogenerador'),
            'uuid_inspeccion': request.query_params.get('uuid_inspeccion')
        }

        # Validar que los parámetros no sean nulos y que sean UUID válidos
        for nombre, valor in parametros.items():
            if not valor:
                return Response({'error': f'El parámetro {nombre} es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            if not is_valid_uuid(valor):
                return Response({'error': f'El parámetro {nombre} no es válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:

            # Validar acceso al aerogenerador y la inspección
            if user.is_cliente:

                # Validar acceso del usuario al aerogenerador
                if not Aerogenerador.objects.filter(
                    uuid_aerogenerador=parametros['uuid_aerogenerador'],
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso al aerogenerador'}, status=status.HTTP_403_FORBIDDEN)

                # Validar acceso del usuario a la inspección
                if not Inspeccion.objects.filter(
                    uuid_inspeccion=parametros['uuid_inspeccion'],
                    uuid_parque_eolico__uuid_empresa_uuid_empresa=user.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a la inspección'}, status=status.HTTP_403_FORBIDDEN)

            # Obtener el estado final
            estado_final = EstadoAerogenerador.objects.get(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_inspeccion=parametros['uuid_inspeccion']
            )
            return Response({'estado_final': estado_final.estado_final_clasificacion}, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (EstadoAerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



 #----------------------------------------------------------------------------------------------------------#

    @action(detail=False, methods=['put'], url_path='cambiar-estado-final')
    def cambiar_estado_final_aerogenerador(self, request):
        """
        Cambiar el estado final de clasificacion de un aerogeneador por inspeccion y aerogenerador
        params: uuid_aerogenerador, uuid_inspeccion, estado_final
        """

        # Obtener usuario autenticado
        user = request.user

        # Obtener y validar los parámetros de la URL
        parametros = {
            'uuid_aerogenerador': request.data.get('uuid_aerogenerador'),
            'uuid_inspeccion': request.data.get('uuid_inspeccion'),
            'estado_final': request.data.get('estado_final')
        }

        # Validar que los parámetros no sean nulos y que sean UUID válidos
        for nombre, valor in parametros.items():
            if not valor:
                return Response({'error': f'El parámetro {nombre} es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            if not is_valid_uuid(valor):
                return Response({'error': f'El parámetro {nombre} no es válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
             # Validar acceso del usuario al aerogenerador
            if user.is_cliente:

                # Validación de acceso para clientes
                if not EstadoAerogenerador.objects.filter(
                    uuid_aerogenerador=parametros['uuid_aerogenerador'],
                    uuid_inspeccion=parametros['uuid_inspeccion'],
                    uuid_aerogenerador__uuid_parque_eolico__uuid_empresa_uuid_empresa=user.uuid_empresa.uuid_empresa
                    ).exists():
                    return Response({'error': 'No tiene acceso a la información de este aerogenerador'}, status=status.HTTP_403_FORBIDDEN)


            estado_aerogenerador = EstadoAerogenerador.objects.get(uuid_aerogenerador=parametros['uuid_aerogenerador'], uuid_inspeccion=parametros['uuid_inspeccion'])
            estado_aerogenerador.estado_final_clasificacion = parametros['estado_final']
            estado_aerogenerador.save()

            return Response({'mensaje': 'Estado final actualizado'}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (EstadoAerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



 #----------------------------------------------------------------------------------------------------------#

    @action(detail=False, methods=['get'], url_path='informacion-aerogenerador')
    def obtener_info_aerogenerador(self, request):
        """
        Obtener la informacion de un aerogenerador por su UUID.
        params: uuid_aerogenerador
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
                # Validación de acceso para clientes
                if not Aerogenerador.objects.filter(
                    uuid_aerogenerador=uuid_aerogenerador_url,
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a la información de este aerogenerador'}, status=status.HTTP_403_FORBIDDEN)


            # Obtener la información del aerogenerador
            aerogenerador = Aerogenerador.objects.get(pk=uuid_aerogenerador_url)
            serializer = AerogeneradorSerializer(aerogenerador)
            return Response(serializer.data, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Aerogenerador.DoesNotExist, ValueError) as e:
             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



 #----------------------------------------------------------------------------------------------------------#

    # OBTENER LISTADO DE AEROGENERADORES POR PARQUE EÓLICO
    @action(detail=False, methods=['get'], url_path='por-parque')
    def listar_por_parque(self, request):
        """
        Obtener todos los aerogeneradores de un parque específico.
        params: uuid_parque_eolico
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener los parámetros de la solicitud
        uuid_parque_eolico_url = request.query_params.get('uuid_parque_eolico')

        # Validar que los parámetros no sean nulos
        if not uuid_parque_eolico_url or not is_valid_uuid(uuid_parque_eolico_url):
            return Response({'error': 'El parámetro uuid_parque_eolico es requerido y debe ser válido'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:

            # Validar acceso del usuario al parque
            if user.is_cliente:
                if not ParquesEolicos.objects.filter(
                    uuid_parque_eolico=uuid_parque_eolico_url,
                    uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    raise PermissionError('No tiene acceso al parque solicitado')


            # Filtrar aerogeneradores por parque eólico
            aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=uuid_parque_eolico_url)

            # Serializar los datos
            serializer = self.get_serializer(aerogeneradores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Aerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


















