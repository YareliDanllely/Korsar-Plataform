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

