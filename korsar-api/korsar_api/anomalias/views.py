from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Anomalia
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Aerogenerador
from collections import defaultdict
from utils.utils import is_valid_uuid
from rest_framework import status
from inspecciones.models import Inspeccion
from rest_framework import generics
from .serializers import AnomaliaSerializer
import re

class AnomaliaViewSet(viewsets.ModelViewSet):
    queryset = Anomalia.objects.all()
    serializer_class = AnomaliaSerializer
    permission_classes = [IsAuthenticated]

#----------------------------------------------------------------------------------------------------------#

    # OBTENER LA CANTIDAD DE SEVERIDADES DE DAÑOS POR INSPECCIÓN
    @action(detail=False, methods=['get'], url_path='severidades-por-inspeccion')
    def obtener_severidades_por_inspeccion(self, request):
        """
        Obtener la cantidad de severidades de daños por inspección.
        params: uuid_inspeccion
        return: lista de severidades
        """
        # Obtener usuario autenticado
        user = request.user

        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        if not uuid_inspeccion_url or not is_valid_uuid(uuid_inspeccion_url):
            return Response({'error': 'El parámetro uuid_inspeccion no es requerido y debe es válido'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar que la inspección pertenece a la empresa del usuario
            if user.is_cliente:
                # Validar que la inspección pertenece a la empresa del usuario
                if not Inspeccion.objects.filter(
                    uuid_inspeccion=uuid_inspeccion_url,
                    uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                    ).exists():
                        return Response({'error': 'No tiene acceso a la inspección'},
                                        status=status.HTTP_403_FORBIDDEN)

            # Filtrar anomalías por uuid_inspeccion (después de validar acceso)
            anomalias = Anomalia.objects.filter(uuid_inspeccion=uuid_inspeccion_url)

            # Obtener las severidades de las anomalías
            severidades = anomalias.values_list('severidad_anomalia', flat=True)
            return Response({'severidades': list(severidades)}, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#----------------------------------------------------------------------------------------------------------#


    # OBTENER LA CANTIDAD DE SEVERIDADES DE DAÑOS POR COMPONENTE
    @action(detail=False, methods=['get'], url_path='severidades-por-componente')
    def obtener_severidades_por_componente(self, request):
        """
        Obtener la cantidad de severidades de daños por componente.
        params: uuid_inspeccion
        return: lista con cantidad de serveridades
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener los parámetros de la URL
        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        # Validar que el parámetro uuid_inspeccion no sea nulo y sea válido
        if not uuid_inspeccion_url or not is_valid_uuid(uuid_inspeccion_url):
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar acceso del usuarrio
            if user.is_cliente:
                if not Anomalia.objects.filter(
                    uuid_inspeccion=uuid_inspeccion_url,
                    uuid_inspeccion__uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a la inspección'},
                                    status=status.HTTP_403_FORBIDDEN)

            # Filtrar anomalías por uuid_inspeccion
            resultados = (
                Anomalia.objects.filter(uuid_inspeccion=uuid_inspeccion_url)
                .values('uuid_componente__tipo_componente', 'severidad_anomalia')
                .annotate(cantidad=Count('severidad_anomalia'))
            )
            return Response({'resultados': list(resultados)}, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#---------------------------------------------------------------------------------------------------------#


    # OBTENER EL SIGUENTE NUMERO DE DAÑO PARA UNA ANOMALIA
    @action(detail=False, methods=['get'], url_path='siguiente-numero-dano')
    def obtener_siguiente_numero_damage(self, request):
        """
        Obtener el siguente numero de daño para una anomalía.
        params: uuid_componente
        return: siguiente número de daño
        """

        # Obtener usuario autenticado
        user = request.user

        # Obtener uuid_componente de los parámetros de la URL
        uuid_componente_url = request.query_params.get('uuid_componente')

        # Validar que el parámetro uuid_componente no sea nulo y sea válido
        if not uuid_componente_url or not is_valid_uuid(uuid_componente_url):
            return Response({'error': 'uuid_componente es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filtrar anomalías por uuid_componente
            anomalias = Anomalia.objects.filter(uuid_componente=uuid_componente_url)

            # Validar acceso del usuario
            if user.is_cliente:
                # Validar que el componente pertenece a la empresa del usuario
                if not Anomalia.objects.filter(
                uuid_componente=uuid_componente_url,
                uuid_aerogenerador__uuid_parque_eolico__uuid_empresa__uuid_empresa=user.uuid_empresa.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a las anomalías del componente'},
                                    status=status.HTTP_403_FORBIDDEN)

            # Lista para almacenar números de daño
            numero_damage = []

            for anomalia in anomalias:
                # Expresión regular ajustada para permitir días de uno o dos dígitos
                match = re.search(r'^\w+-\d{6,8}-\d-(\d{4})-\d$', anomalia.codigo_anomalia)
                if match:
                    numero_damage.append(int(match.group(1)))  # Agregar el número de daño a la lista

            # Calcular el siguiente número de daño
            siguiente_numero_dano = (max(numero_damage) + 1) if numero_damage else 1

            return Response({'siguiente_numero_dano': f"{siguiente_numero_dano:04d}"}, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

        params:
            uuid_aerogenerador (str): UUID del aerogenerador.
            uuid_inspeccion (str): UUID de la inspección.

        return:
            dict:
                {
                    "helice_a": [<Anomalia data>],
                    "helice_b": [<Anomalia data>],
                    "helice_c": [<Anomalia data>],
                    "torre": [<Anomalia data>],
                    "nacelle": [<Anomalia data>]
                }
                - Cada clave contiene una lista de anomalías serializadas relacionadas con el componente específico.
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener y validar los parámetros de la URL
        parametros = {
            'uuid_aerogenerador': request.data.get('uuid_aerogenerador'),
            'uuid_inspeccion': request.data.get('uuid_inspeccion'),
        }

        # Validar que los parámetros no sean nulos y que sean UUID válidos
        for nombre, valor in parametros.items():
            if not valor:
                return Response({'error': f'El parámetro {nombre} es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            if not is_valid_uuid(valor):
                return Response({'error': f'El parámetro {nombre} no es válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:

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


            # Obtener anomalías filtradas
            anomalias = Anomalia.objects.filter(uuid_aerogenerador=parametros['uuid_aerogenerador'], uuid_inspeccion=parametros['uuid_inspeccion'])

                # Diccionario de mapeo para traducir los nombres de la base de datos a las claves esperadas
            componente_map = {
                'Hélice A': 'helice_a',
                'Hélice B': 'helice_b',
                'Hélice C': 'helice_c',
                'Torre': 'torre',
                'Nacelle/Hub': 'nacelle'
            }

            # Inicializar el diccionario con arrays vacíos para cada tipo esperado
            tipos_componentes_esperados = ['helice_a', 'helice_b', 'helice_c', 'torre', 'nacelle']
            anomalias_por_tipo = {tipo: [] for tipo in tipos_componentes_esperados}

            # Agregar anomalías al tipo correspondiente
            for anomalia in anomalias:
                tipo_componente = componente_map.get(anomalia.uuid_componente.tipo_componente)
                if tipo_componente:  # Verifica si el tipo de componente existe en el mapeo
                    anomalias_por_tipo[tipo_componente].append(anomalia)
                else:
                    print(f"Tipo de componente no reconocido: {anomalia.uuid_componente.tipo_componente}")

            # Serializar los datos de anomalías
            data = {
                tipo: AnomaliaSerializer(anomalias, many=True).data
                for tipo, anomalias in anomalias_por_tipo.items()
            }

            return Response(data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
         return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#----------------------------------------------------------------------------------------------------------#

    # FILTRAR ANOMALIAS POR AEROGENERADOR, COMPONENTE E INSPECCION
    @action(detail=False, methods=['get'], url_path='filtrar-por-aerogenerador-componente-inspeccion')
    def filtrar_anomalias(self, request):
        """
        Filtrar anomalías por aerogenerador, componente e inspección.

        params:
            uuid_aerogenerador (str): UUID del aerogenerador.
            uuid_componente (str): UUID del componente.
            uuid_inspeccion (str): UUID de la inspección.

        return:
            list:
                Una lista de anomalías serializadas que coinciden con los parámetros especificados.
                Ejemplo:
                [
                    {
                        "uuid_anomalia": <str>,
                        "uuid_aerogenerador": <str>,
                        "uuid_componente": <str>,
                        "uuid_inspeccion": <str>,
                        "uuid_tecnico": <str>,
                        "codigo_anomalia": <str>
                        ...
                    },
                    ...
                ]
        """
        # Obtener usuario autenticado
        user = request.user

        # Obtener parámetros de la solicitud
        parametros = {
            'uuid_aerogenerador': request.query_params.get('turbina'),
            'uuid_componentenente': request.query_params.get('componente'),
            'uuid_inspeccion': request.query_params.get('inspeccion'),
        }

        # Validar que los parámetros no sean nulos y que sean UUID válidos
        for nombre, valor in parametros.items():
            if not valor:
                return Response({'error': f'El parámetro {nombre} es requerido'}, status=status.HTTP_400_BAD_REQUEST)
            if not is_valid_uuid(valor):
                return Response({'error': f'El parámetro {nombre} no es válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:

            if user.is_cliente:
                if not Anomalia.objects.filter(
                    uuid_aerogenerador=parametros['uuid_aerogenerador'],
                    uuid_componente=parametros['uuid_componente'],
                    uuid_inspeccion=parametros['uuid_inspeccion'],
                    uuid_aerogenerador__uuid_parque_eolico__uuid_empresa=user.uuid_empresa
                ).exists():
                    return Response({'error': 'No tiene acceso a las anomalías del componente'},
                                    status=status.HTTP_403_FORBIDDEN)


            # Obtener el queryset de anomalías después de la validación
            queryset = Anomalia.objects.filter(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_componente=parametros['uuid_componente'],
                uuid_inspeccion=parametros['uuid_inspeccion']
            )

            # Serializar y devolver los datos
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#----------------------------------------------------------------------------------------------------------#

