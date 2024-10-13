from rest_framework import viewsets
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Imagen
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ImagenSerializer

class ImagenViewSet(viewsets.ModelViewSet):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer
    permission_classes = [IsAuthenticated]

    # Cambiar la clasificación de una imagen por uuid_imagen
    @action(detail=True, methods=['post'], url_path='cambiar-clasificacion')
    def cambiar_clasificacion(self, request, pk=None):
        nueva_clasificacion = request.data.get('estado_clasificacion')

        # Verificamos que la clasificación sea válida
        if nueva_clasificacion not in ['no_clasificada', 'con_dano', 'sin_dano']:
            return Response({'estado_clasificacion': 'Clasificación no válida'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtenemos la imagen y actualizamos su estado
        imagen = self.get_object()
        imagen.estado_clasificacion = nueva_clasificacion
        imagen.save()

        return Response({'estado_clasificacion': nueva_clasificacion}, status=status.HTTP_200_OK)


# Obtener imagenes por componente, aerogenerador e inspeccion(*****)

class ImagenFiltradaListView(generics.ListAPIView):
    """
    Vista que permite filtrar las imágenes por parque, aerogenerador y componente.
    """
    #
    serializer_class = ImagenSerializer

    #Solo para usuarios autenticados
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # Obtiene el id del usuario autenticado
        queryset = Imagen.objects.all()

        #Recuperamos los parametros de la url
        uuid_aerogenerador_url = self.request.query_params.get('aerogeneradores')
        uuid_componente_url = self.request.query_params.get('componente')
        uuid_parque_url = self.request.query_params.get('parque_eolico')


        if uuid_aerogenerador_url and uuid_componente_url and uuid_parque_url:
            queryset = queryset.filter(
                uuid_aerogenerador=uuid_aerogenerador_url,  # Filtrar por UUID del aerogenerador
                uuid_componente=uuid_componente_url,  # Filtrar por UUID del componente
                uuid_aerogenerador__uuid_parque_eolico=uuid_parque_url  # Filtrar por UUID del parque
            )
        else:
            queryset = queryset.none()

        return queryset

