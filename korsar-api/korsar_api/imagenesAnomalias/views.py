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


    # Obtener todas las imagenes asociadas a una anomalia
    @action(detail=True, methods=['get'], url_path='filtrar-anomalias')
    def listar_imagenes_por_anomalia(self, request, pk=None):
        """
        Obtener todas las imagenes asociadas a una anomalia
        """
        # Filtramos las imagenes por anomalia
        imagenes_anomalias = ImagenAnomalia.objects.filter(uuid_anomalia=pk)

        # Obtenemos las imagenes asociadas a las anomalias
        imagenes = Imagen.objects.filter(uuid_imagen__in=[ia.uuid_imagen.uuid_imagen for ia in imagenes_anomalias])

        # Serializamos las imagenes
        serializer = ImagenSerializer(imagenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
