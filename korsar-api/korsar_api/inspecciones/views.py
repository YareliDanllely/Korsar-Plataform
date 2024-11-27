from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inspeccion
from .serializers import InspeccionSerializer
from .models import ParquesEolicos
from anomalias.models import Anomalia
from utils.validarAcceso import ValidarAcceso
from rest_framework.exceptions import ValidationError
from empresas.models import Empresa
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from uuid import UUID
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .models import Inspeccion, ParquesEolicos
from .serializers import InspeccionSerializer
from anomalias.models import Anomalia


class InspeccionViewSet(viewsets.ModelViewSet):
    """
    API para gestionar inspecciones, incluyendo lógica de consultas por parque y empresa.
    """
    queryset = Inspeccion.objects.all()
    serializer_class = InspeccionSerializer
    permission_classes = [IsAuthenticated]


    def retrieve(self, request, *args, **kwargs):
        """
        Obtener la información de una inspección por su UUID.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


#----------------------------------------------------------------------------------#

    @action(detail=False, methods=['get'], url_path='por-usuario')
    def inspecciones_por_usuario(self, request):
        """
        Retorna las inspecciones dependiendo del tipo de usuario autenticado.
        """
        user = request.user

        try:

            if user.is_tecnico():  # Usuario es Técnico
                # Técnicos obtienen todas las inspecciones
                inspecciones = Inspeccion.objects.all()

            elif user.is_cliente():  # Usuario es Cliente
                # Clientes obtienen inspecciones solo de su empresa
                if not user.uuid_empresa:
                    return Response(
                        {"detail": "El usuario no está asociado a ninguna empresa."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Filtrar parques de la empresa del cliente
                parques = ParquesEolicos.objects.filter(uuid_empresa=user.uuid_empresa)

                # Filtrar inspecciones de esos parques
                inspecciones = Inspeccion.objects.filter(uuid_parque_eolico__in=parques).exclude(progreso=0)

            # Serializar y retornar inspecciones
            serializer = self.get_serializer(inspecciones, many=True)
            return Response(serializer.data)


        # Manejo de excepciones
        except (Inspeccion.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






#----------------------------------------------------------------------------------#


    @action(detail=True, methods=['get'], url_path='ultima-y-proxima-inspeccion')
    def ultima_y_proxima_inspeccion(self, request, pk=None):
        """
        Devuelve la última inspección y la próxima inspección para un parque específico.
        """
        # Instaciar el validador
        validador  = ValidarAcceso(request.user)

        try:

            # Validar el pk y el acceso del usuario al recurso
            validador.validar_recurso(pk, ParquesEolicos.existe_aerogenerador_para_usuario)

            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=pk).latest('fecha_inspeccion')

            data = {
                'ultima_inspeccion': self.get_serializer(ultima_inspeccion).data if ultima_inspeccion else None,
                'proxima_inspeccion': ultima_inspeccion.fecha_siguiente_inspeccion.isoformat() if ultima_inspeccion and ultima_inspeccion.fecha_siguiente_inspeccion else None
            }


            return Response(data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (ParquesEolicos.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#----------------------------------------------------------------------------------#


    @action(detail=True, methods=['get'], url_path='ultima-y-proxima-inspeccion-empresa')
    def ultima_y_proxima_inspeccion_empresa(self, request, pk=None):
        """
        Devuelve las últimas y próximas inspecciones para todos los parques de una empresa usando pk.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)


        try:
            # Validar el pk y el acceso del usuario al recurso
            validador.validar_recurso(pk, Empresa.usuario_tiene_acceso)

            # Filtrar los parques asociados a la empresa
            parques = ParquesEolicos.objects.filter(uuid_empresa=pk)

            # Obtener inspecciones asociadas a los parques
            inspecciones = []
            for parque in parques:
                # Obtener la última inspección
                ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=parque).order_by('-fecha_inspeccion').first()
                print(f"Parque: {parque.nombre_parque}, Última inspección: {ultima_inspeccion.fecha_inspeccion}")

                # Agregar la información al resultado
                inspecciones.append({
                    'uuid_parque_eolico': str(parque.uuid_parque_eolico),  # Convertimos UUID a string
                    'uuid_inspeccion': str(ultima_inspeccion.uuid_inspeccion) if ultima_inspeccion else None,
                    'fecha_inspeccion': ultima_inspeccion.fecha_inspeccion.isoformat() if ultima_inspeccion and ultima_inspeccion.fecha_inspeccion else None,
                    'fecha_siguiente_inspeccion': ultima_inspeccion.fecha_siguiente_inspeccion.isoformat() if ultima_inspeccion and ultima_inspeccion.fecha_siguiente_inspeccion else None,
                })


            print(f"Inspecciones encontradas: {inspecciones}")
            return Response({'inspecciones': inspecciones}, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (ParquesEolicos.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#----------------------------------------------------------------------------------#


    @action(detail=False, methods=['post'], url_path='cambiar-progreso')
    def cambiar_progreso(self, request):
        """
        Cambiar el progreso de una inspección.
        Exclusiva de técnicos.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_inspeccion': True,
                    'progreso': False,
                }
            )

            inspeccion = Inspeccion.objects.get(uuid_inspeccion=parametros['uuid_inspeccion'])
            inspeccion.progreso = parametros['progreso']
            inspeccion.save()

            return Response({'mensaje': 'Progreso actualizado correctamente'}, status=status.HTTP_200_OK)


        except (Inspeccion.DoesNotExist,ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#----------------------------------------------------------------------------------#


    @action(detail=True, methods=['get'], url_path='cantidad-severidades-por-componente')
    def cantidad_severidades_por_componente(self, request, pk=None):
        """
        Obtener la cantidad de severidades por tipo de componente en una inspección,
        validando que el usuario tenga acceso a la inspección.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            validador.validar_recurso(pk, Inspeccion.existe_inspeccion_para_usuario)

            # Obtener severidades
            severidades = (
                Anomalia.objects
                .filter(uuid_inspeccion=pk)
                .values('ubicacion_componente', 'severidad_anomalia')
                .annotate(total_severidades=Count('severidad_anomalia'))
                .order_by('ubicacion_componente', 'severidad_anomalia')
            )

            # Procesar resultado
            respuesta = {}
            for item in severidades:
                ubicacion = dict(Anomalia.UBICACION_COMPONENTE_CHOICES).get(item['ubicacion_componente'], 'Desconocido')
                severidad = dict(Anomalia.SEVERIDAD_CHOICES).get(item['severidad_anomalia'], 'Desconocido')

                if ubicacion not in respuesta:
                    respuesta[ubicacion] = {}

                respuesta[ubicacion][severidad] = item['total_severidades']

            return Response(respuesta, status=status.HTTP_200_OK)


        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#----------------------------------------------------------------------------------#


    @action(detail=True, methods=['get'], url_path='informacion-ultima-inspeccion')
    def informacion_ultima_inspeccion(self, request, pk=None):
        """
        Obtener la información de la última inspección completada por parque eólico.
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            validador.validar_recurso(pk, ParquesEolicos.existe_aerogenerador_para_usuario)

            # Filtrar la última inspección completada por parque eólico (excluyendo progreso=0)
            ultima_inspeccion = Inspeccion.objects.filter(
                uuid_parque_eolico=pk
            ).exclude(progreso=0).latest('fecha_inspeccion')

            # Serializar y retornar la información de la inspección
            serializer = self.get_serializer(ultima_inspeccion)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Inspeccion.DoesNotExist:
            return Response({'error': 'No se encontró ninguna inspección completada para el parque eólico indicado'},
                            status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






