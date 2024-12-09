from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from utils.validarAcceso import ValidarAcceso
from .models import Aerogenerador
from parquesEolicos.models import ParquesEolicos
from inspecciones.models import Inspeccion
from .serializers import AerogeneradorSerializer
from estadoAerogeneradores.models import EstadoAerogenerador


class AerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = Aerogenerador.objects.all()
    serializer_class = AerogeneradorSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder





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
        # Instaciar el validador
        validador  = ValidarAcceso(request.user)

        try:
            # Validar parametros y pertenecia de recursos
            parametros = validador.validar_query_params(
                parametros= {
                    'uuid_parque_eolico': True,
                    'uuid_inspeccion': True,
                },
                request_data=request.query_params,
                validaciones_por_parametro={
                    'uuid_parque_eolico': ParquesEolicos.existe_parque_para_usuario,
                    'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
                }
            )

            # Filtrar los aerogeneradores por parque
            aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=parametros['uuid_parque_eolico'])

            # Obtener el estado final de los aerogeneradores por inspección
            aerogeneradores_con_estado = []
            for aerogenerador in aerogeneradores:

                try:

                    estado_final = EstadoAerogenerador.objects.get(
                        uuid_aerogenerador=aerogenerador.uuid_aerogenerador,
                        uuid_inspeccion=parametros['uuid_inspeccion']
                    )

                    estado_final_clasificacion = estado_final.estado_final_clasificacion

                except EstadoAerogenerador.DoesNotExist:
                    estado_final_clasificacion = "No disponible"

                # Agregar la información del aerogenerador y su estado final a la lista
                aerogeneradores_con_estado.append({
                    'uuid_aerogenerador': aerogenerador.uuid_aerogenerador,
                    'numero_aerogenerador': aerogenerador.numero_aerogenerador,
                    'estado_final': estado_final_clasificacion,
                    'coordenada_latitud': aerogenerador.coordenada_latitud,
                    'coordenada_longitud': aerogenerador.coordenada_longitud
                })

            return Response(aerogeneradores_con_estado, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (ValueError, PermissionError, ValidationError) as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
                return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 #----------------------------------------------------------------------------------------------------------#

    # OBTENER NUMERO DE AEROGENERADOR
    @action(detail=True, methods=['get'], url_path='numero-aerogenerador')
    def obtener_numero_aerogenerador(self, request, pk=None):
        """
        Obtener el número de un aerogenerador basado en su UUID.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar el pk y el acceso del usuario al recurso
            validador.validar_recurso(pk, Aerogenerador.existe_aerogenerador_para_usuario)

            # Obtener el número del aerogenerador
            aerogenerador = Aerogenerador.objects.get(pk=pk)
            return Response({'numero_aerogenerador': aerogenerador.numero_aerogenerador}, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Aerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Manejo de excepciones
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 #----------------------------------------------------------------------------------------------------------#

    @action(detail=False, methods=['get'], url_path='estado-final')
    def obtener_estado_final_aerogenerador(self, request):
        """
        Obtener el estado final de clasificacion de un aerogenerador por inspeccion y aerogenerador
        params: uuid_aerogenerador, uuid_inspeccion
        """
        # Instanciar validador
        validador = ValidarAcceso(request.user)

        try:
            parametros = validador.validar_query_params(
                parametros = {
                        'uuid_aerogenerador': True,
                        'uuid_inspeccion': True
                    },
                    request_data=request.query_params,
                    validaciones_por_parametro={
                        'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario,
                        'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
                    }
             )

            # Intentar obtener el estado final del aerogenerador
            try:
                estado_final = EstadoAerogenerador.objects.get(
                    uuid_aerogenerador=parametros['uuid_aerogenerador'],
                    uuid_inspeccion=parametros['uuid_inspeccion']
                )
                estado_final_clasificacion = estado_final.estado_final_clasificacion

            except EstadoAerogenerador.DoesNotExist:
                    estado_final_clasificacion = "No disponible"


            return Response({'estado_final': estado_final_clasificacion}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (ValueError, PermissionError, ValidationError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


 #----------------------------------------------------------------------------------------------------------#

    @action(detail=False, methods=['put'], url_path='cambiar-estado-final')
    def cambiar_estado_final_aerogenerador(self, request):
        """
        Cambiar el estado final de clasificación de un aerogenerador por inspección y aerogenerador.
        params: uuid_aerogenerador, uuid_inspeccion, estado_final
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar parámetros y acceso
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_aerogenerador': True,
                    'uuid_inspeccion': True,
                    'estado_final': False,  # No es un UUID, pero es obligatorio
                },
                request_data=request.data,
                validaciones_por_parametro={
                    'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario,
                    'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
                }
            )

            # Intentar obtener el estado del aerogenerador
            estado_aerogenerador = EstadoAerogenerador.objects.get(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_inspeccion=parametros['uuid_inspeccion']
            )

            # Actualizar el estado final
            estado_aerogenerador.estado_final_clasificacion = parametros['estado_final']
            estado_aerogenerador.save()

            return Response({'mensaje': 'Estado final actualizado correctamente'}, status=status.HTTP_200_OK)

        # Manejo de excepciones

        except (EstadoAerogenerador.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


 #----------------------------------------------------------------------------------------------------------#

    # OBTENER LISTADO DE AEROGENERADORES POR PARQUE EÓLICO
    @action(detail=True, methods=['get'], url_path='por-parque')
    def listar_por_parque(self, request, pk=None):
        """
        Obtener todos los aerogeneradores de un parque específico utilizando el pk (uuid_parque_eolico).
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar el pk y acceso al parque eólico
            validador.validar_recurso(
                pk=pk,
                metodo_validacion=ParquesEolicos.existe_parque_para_usuario
            )

            # Filtrar aerogeneradores por parque eólico
            aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=pk)

            if not aerogeneradores.exists():
                return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

            # Serializar los datos
            serializer = self.get_serializer(aerogeneradores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except (ValueError, ValidationError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#----------------------------------------------------------------------------------------------------------#

    #OBTENER INFORMACION DE AEROGEENRADOR POR SU UUID
    @action(detail=True, methods=['get'], url_path='informacion-aerogenerador')
    def informacion_aerogenerador(self, request, pk=None):
        """
        Obtener la información de un aerogenerador basado en su UUID.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar el pk y el acceso del usuario al recurso
            validador.validar_recurso(pk, Aerogenerador.existe_aerogenerador_para_usuario)

            # Obtener la información del aerogenerador
            try:
                aerogenerador = Aerogenerador.objects.get(pk=pk)
                serializer = self.get_serializer(aerogenerador)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Aerogenerador.DoesNotExist:
                return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

        except (ValueError, ValidationError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


