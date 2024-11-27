from rest_framework import viewsets
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Imagen
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ImagenSerializer
from utils.validarAcceso import ValidarAcceso



class ImagenViewSet(viewsets.ModelViewSet):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer
    permission_classes = [IsAuthenticated]


class ImagenFiltradaListView(generics.ListAPIView):
    """
    Vista que permite filtrar las imágenes por parque, aerogenerador y componente.
    """
    serializer_class = ImagenSerializer
    permission_classes = [IsAuthenticated]  # Solo para usuarios autenticados

    def get_queryset(self):
        # Instanciar el validador
        validador = ValidarAcceso(self.request.user)

        try:
            # Validar los parámetros de la URL
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_aerogenerador': True,
                    'uuid_componente': True,
                    'uuid_parque_eolico': True,
                },
                request_data=self.request.query_params,
                validaciones_por_parametro={
                    'uuid_aerogenerador': Imagen.existe_aerogenerador_para_usuario,
                    'uuid_parque_eolico': Imagen.existe_parque_para_usuario,
                    'uuid_componente': Imagen.existe_componente_para_usuario,
                }
            )


            # Filtrar imágenes por los parámetros validados
            queryset = Imagen.objects.filter(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_componente=parametros['uuid_componente'],
                uuid_aerogenerador__uuid_parque_eolico=parametros['uuid_parque_eolico']
            )


            return queryset

        # Manejo de excepciones
        except (Imagen.DoesNotExist, ValueError) as e:
            return Response({'error': 'Empresa no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


