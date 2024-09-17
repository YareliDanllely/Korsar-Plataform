from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inspeccion
from .serializers import InspeccionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class InspeccionViewSet(viewsets.ModelViewSet):
    """
    Definición de las operaciones CRUD para las inspecciones
    """

    queryset = Inspeccion.objects.all()
    serializer_class = InspeccionSerializer
    permission_classes = [IsAuthenticated]

    # Definir consulta para obtener informacion de la ultima inspeccion, asociado a un parque en especifico
    @action(detail=False, methods=['get'], url_path='ultima-inspeccion-parque')
    def ultima_inspeccion_parque(self, request):
        uuid_parque = request.query_params.get('uuid_parque')

        if uuid_parque is None:
            return Response({'error': 'uuid_parque es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ultima_inspeccion = Inspeccion.objects.filter(parque__uuid=uuid_parque).latest('fecha')
            serializer = self.get_serializer(ultima_inspeccion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Inspeccion.DoesNotExist:
            return Response({'error': 'No se encontró inspección'}, status=status.HTTP_404_NOT_FOUND)


    # Definir consulta para obtener de una inspeccion en especifico
    # ultima inspeccion y proxima
    @action(detail=False, methods=['get'], url_path='inspeccion-ultima-proxima')
    def ultima_proxima_inspeccion(self,request):
        uuid_parque = request.query_params.get('uuid_parque')

        if not uuid_parque:
            return Response({'error': 'uuid_parque es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Última inspección (más reciente en el pasado)
        try:
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque=uuid_parque).latest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            ultima_inspeccion = None

        # Próxima inspección (la más cercana en el futuro)
        try:
            proxima_inspeccion = Inspeccion.objects.filter(uuid_parque=uuid_parque, fecha_inspeccion__gt=ultima_inspeccion.fecha_inspeccion).earliest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            proxima_inspeccion = None

        data = {
            'ultima_inspeccion': self.get_serializer(ultima_inspeccion).data if ultima_inspeccion else None,
            'proxima_inspeccion': self.get_serializer(proxima_inspeccion).data if proxima_inspeccion else None
        }
        return Response(data, status=status.HTTP_200_OK)

