from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ImagenAnomalia, Imagen
from rest_framework.decorators import action
from rest_framework import status
from imagenes.serializers import ImagenSerializer
from rest_framework.response import Response
from .serializers import ImagenAnomaliaSerializer

class ImagenAnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definición de las operaciones CRUD para las imagenes de anomalias
    """
    queryset = ImagenAnomalia.objects.all()
    serializer_class = ImagenAnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder


   # Obtener todas las imágenes asociadas a una anomalía
    @action(detail=False, methods=['get'], url_path='filtrar-anomalias')
    def listar_imagenes_por_anomalia(self, request):
        """
        Obtener todas las imágenes asociadas a una anomalía
        """
        uuid_anomalia = request.query_params.get('uuid_anomalia')

        # Filtramos las imágenes por anomalía
        imagenes_anomalias = ImagenAnomalia.objects.filter(uuid_anomalia=uuid_anomalia)

        # Construimos el objeto de respuesta
        imagenes_data = [
            {
                'uuid_imagen_anomalia': ia.uuid_imagen_anomalia,
                'uuid_imagen': ia.uuid_imagen.uuid_imagen,
                'ruta_imagen': ia.uuid_imagen.ruta_imagen,
            }
            for ia in imagenes_anomalias
        ]

        return Response(imagenes_data, status=status.HTTP_200_OK)

    # Eliminar una imagen específica asociada a una anomalía
    @action(detail=False, methods=['post'], url_path='eliminar-imagenes')
    def eliminar_imagenes(self, request):
        """
        Eliminar múltiples imágenes asociadas a anomalías.
        """
        imagenes_ids = request.data.get('imagenes_ids', [])
        if not imagenes_ids:
            return Response({'detail': 'No se proporcionaron imágenes para eliminar.'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar y eliminar las imágenes por los IDs proporcionados.
        try:
            ImagenAnomalia.objects.filter(uuid_imagen_anomalia__in=imagenes_ids).delete()
            return Response({'detail': 'Imágenes eliminadas correctamente.'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': f'Error al eliminar imágenes: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
