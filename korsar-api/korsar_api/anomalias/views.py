from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Aerogenerador
from utils.validarAcceso import ValidarAcceso
from rest_framework.exceptions import ValidationError
from rest_framework import status
from inspecciones.models import Inspeccion
from componentesAerogenerador.models import ComponenteAerogenerador
from .serializers import AnomaliaSerializer
import re

class AnomaliaViewSet(viewsets.ModelViewSet):
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]

#----------------------------------------------------------------------------------------------------------#


    # OBTENER LA CANTIDAD DE SEVERIDADES DE DAÑOS POR INSPECCIÓN
    @action(detail=True, methods=['get'], url_path='severidades-por-inspeccion')
    def obtener_severidades_por_inspeccion(self, request, pk=None):
        """
        Obtener la cantidad de severidades de daños por inspección.
        """
        validador = ValidarAcceso(request.user)
        try:
            # Validar pk de inspección
            validador.validar_recurso(
                pk=pk,
                metodo_validacion=Inspeccion.existe_inspeccion_para_usuario
            )

            # Filtrar anomalías por inspección
            anomalias = Anomalia.objects.filter(uuid_inspeccion=pk)

            if not anomalias.exists():
                return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

            severidades = anomalias.values_list('severidad_anomalia', flat=True)
            return Response({'severidades': list(severidades)}, status=status.HTTP_200_OK)

        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#----------------------------------------------------------------------------------------------------------#

    # OBTENER LA CANTIDAD DE SEVERIDADES DE DAÑOS POR COMPONENTE
    @action(detail=True, methods=['get'], url_path='severidades-por-componente')
    def obtener_severidades_por_componente(self, request, pk=None):
        """
        Obtener la cantidad de severidades de daños por componente.
        """
        validador = ValidarAcceso(request.user)
        try:
            # Validar pk de inspección
            validador.validar_recurso(
                pk=pk,
                metodo_validacion=Inspeccion.existe_inspeccion_para_usuario
            )

            # Filtrar anomalías por inspección
            anomalias = Anomalia.objects.filter(uuid_inspeccion=pk)

            if not anomalias.exists():
                return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

            severidades = anomalias.values_list('severidad_anomalia', flat=True)
            return Response({'severidades': list(severidades)}, status=status.HTTP_200_OK)

        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#---------------------------------------------------------------------------------------------------------#


    # OBTENER EL SIGUENTE NUMERO DE DAÑO PARA UNA ANOMALIA
    @action(detail=True, methods=['get'], url_path='siguiente-numero-dano')
    def obtener_siguiente_numero_damage(self, request, pk=None):
        """
        Obtener el siguiente número de daño para una anomalía.
        """
        validador = ValidarAcceso(request.user)
        try:
            # Validar pk del componente
            validador.validar_recurso(pk=pk)

            # Filtrar anomalías por uuid_componente
            anomalias = Anomalia.objects.filter(uuid_componente=pk)

            # Extraer números de daño
            numero_damage = []
            for anomalia in anomalias:
                print("Procesando código:", anomalia.codigo_anomalia)  # Verificar cada código
                match = re.search(r'^\w+-\d{6,8}-\d-[\w/]+-(\d{4})-\d$', anomalia.codigo_anomalia)

                if match:
                    numero_damage.append(int(match.group(1)))
                print("Números de daño:", numero_damage)


            # Calcular el siguiente número de daño
            siguiente_numero_dano = (max(numero_damage) + 1) if numero_damage else 1
            print("Siguiente número de daño:", siguiente_numero_dano)
            return Response({'siguiente_numero_dano': f"{siguiente_numero_dano:04d}"}, status=status.HTTP_200_OK)

        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






#----------------------------------------------------------------------------------------------------------#

    # OBTENER ANOMALIAS POR AEROGENERADOR
    @action(detail=False, methods=['get'], url_path='anomalias-por-aerogenerador')
    def obtener_anomalias_por_aerogenerador(self, request):
        """
        Obtener todas las anomalías asociadas a un aerogenerador, por uuid aerogenerador y uuid inspección.
        """
        validador = ValidarAcceso(request.user)
        try:

            print("QUERY PARAMS:", request.query_params)
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_aerogenerador': True,
                    'uuid_inspeccion': True
                },
                request_data=request.query_params,
                validaciones_por_parametro={
                    'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario,
                    'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
                }
            )
            print("PARAMETROS:", parametros)

            anomalias = Anomalia.objects.filter(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_inspeccion=parametros['uuid_inspeccion']
            )

            print("ANOMALIAS:", anomalias)

            if not anomalias.exists():
                return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

            tipos_componentes_esperados = ['helice_a', 'helice_b', 'helice_c', 'torre', 'nacelle']
            anomalias_por_tipo = {tipo: [] for tipo in tipos_componentes_esperados}

            for anomalia in anomalias:
                tipo_componente = anomalia.uuid_componente.tipo_componente
                if tipo_componente:
                    anomalias_por_tipo[tipo_componente].append(anomalia)

            data = {
                tipo: AnomaliaSerializer(anomalias, many=True).data
                for tipo, anomalias in anomalias_por_tipo.items()
            }

            return Response(data, status=status.HTTP_200_OK)

        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#----------------------------------------------------------------------------------------------------------#

    # # FILTRAR ANOMALIAS POR AEROGENERADOR, COMPONENTE E INSPECCION
    # @action(detail=False, methods=['get'], url_path='anomalias-por-aerogenerador')
    # def obtener_anomalias_por_aerogenerador(self, request):
    #     """
    #     Obtener todas las anomalías asociadas a un aerogenerador, por uuid aerogenerador y uuid inspección.
    #     """
    #     validador = ValidarAcceso(request.user)
    #     try:
    #         parametros = validador.validar_query_params(
    #             parametros={
    #                 'uuid_aerogenerador': True,
    #                 'uuid_inspeccion': True
    #             },
    #             request_data=request.query_params,
    #             validaciones_por_parametro={
    #                 'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario,
    #                 'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
    #             }
    #         )

    #         anomalias = Anomalia.objects.filter(
    #             uuid_aerogenerador=parametros['uuid_aerogenerador'],
    #             uuid_inspeccion=parametros['uuid_inspeccion']
    #         )

    #         if not anomalias.exists():
    #             return Response({'mensaje': 'No disponible'}, status=status.HTTP_200_OK)

    #         componente_map = {
    #             'Hélice A': 'helice_a',
    #             'Hélice B': 'helice_b',
    #             'Hélice C': 'helice_c',
    #             'Torre': 'torre',
    #             'Nacelle/Hub': 'nacelle'
    #         }

    #         tipos_componentes_esperados = ['helice_a', 'helice_b', 'helice_c', 'torre', 'nacelle']
    #         anomalias_por_tipo = {tipo: [] for tipo in tipos_componentes_esperados}

    #         for anomalia in anomalias:
    #             tipo_componente = componente_map.get(anomalia.uuid_componente.tipo_componente)
    #             if tipo_componente:
    #                 anomalias_por_tipo[tipo_componente].append(anomalia)

    #         data = {
    #             tipo: AnomaliaSerializer(anomalias, many=True).data
    #             for tipo, anomalias in anomalias_por_tipo.items()
    #         }

    #         return Response(data, status=status.HTTP_200_OK)

    #     except (Anomalia.DoesNotExist, ValueError) as e:
    #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    #     except ValidationError as e:
    #         return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    #     except PermissionError as e:
    #         return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

    #     except Exception as e:
    #         return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#----------------------------------------------------------------------------------------------------------#

    # OBTENER ANOMALIAS POR COMPONENTE

    # FILTRAR ANOMALIAS POR AEROGENERADOR, COMPONENTE E INSPECCION
    @action(detail=False, methods=['get'], url_path='filtrar-por-aerogenerador-componente-inspeccion')
    def filtrar_anomalias(self, request):
        """
        Filtrar anomalías por aerogenerador, componente e inspección.
        """
        # Instanciar validador
        validador = ValidarAcceso(request.user)

        try:
            # Validar los parámetros de la solicitud
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_aerogenerador': True,
                    'uuid_componente': True,
                    'uuid_inspeccion': True
                },
                request_data=request.query_params,
                validaciones_por_parametro={
                    'uuid_aerogenerador': Aerogenerador.existe_aerogenerador_para_usuario,
                    'uuid_componente': ComponenteAerogenerador.existe_componente_para_usuario,
                    'uuid_inspeccion': Inspeccion.existe_inspeccion_para_usuario
                }
            )

            try:
                # Obtener el queryset de anomalías después de la validación
                anomalias = Anomalia.objects.filter(
                    uuid_aerogenerador=parametros['uuid_aerogenerador'],
                    uuid_componente=parametros['uuid_componente'],
                    uuid_inspeccion=parametros['uuid_inspeccion']
                )

            except Anomalia.DoesNotExist:
                return Response({'error': 'No se encontraron anomalías'}, status=status.HTTP_200_OK)

            # Serializar y devolver los datos
            serializer = self.get_serializer(anomalias, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
