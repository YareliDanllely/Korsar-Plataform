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
    @action(detail=True, methods=['delete'], url_path='eliminar-imagen')
    def eliminar_imagen(self, request, pk=None):
        """
        Eliminar una imagen específica asociada a una anomalía.
        """
        try:
            # Obtener la instancia de la imagen-anomalía
            imagen_anomalia = self.get_object()
            imagen_anomalia.delete()
            return Response({'detail': 'Imagen eliminada correctamente.'}, status=status.HTTP_204_NO_CONTENT)
        except ImagenAnomalia.DoesNotExist:
            return Response({'detail': 'Imagen no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
