from rest_framework import viewsets
from rest_framework import status
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

    @action(detail=False, methods=['get'], url_path='filtrar')
    def filtrar_imagenes(self, request):
        """
        Filtra imágenes por parque, aerogenerador y componente.
        """
        validador = ValidarAcceso(request.user)

        try:
            # Validar los parámetros de la URL
            parametros = validador.validar_query_params(
                parametros={
                    'uuid_aerogenerador': True,
                    'uuid_componente': True,
                    'uuid_inspeccion': True,
                },
                request_data=request.query_params,
            )

            # Filtrar imágenes por los parámetros validados
            queryset = Imagen.objects.filter(
                uuid_aerogenerador=parametros['uuid_aerogenerador'],
                uuid_componente=parametros['uuid_componente'],
                uuid_inspeccion=parametros['uuid_inspeccion']
            )


            # Serializar los datos
            serializer = self.get_serializer(queryset, many=True)

            # Devolver la respuesta serializada
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
