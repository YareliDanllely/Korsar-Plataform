from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inspeccion
from .serializers import InspeccionSerializer
from .models import ParquesEolicos
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

    @action(detail=False, methods=['get'], url_path='ultima-inspeccion-parque-eolico')
    def ultima_inspeccion_parque(self, request):
        """
        Obtener la última inspección de un parque eólico en específico
        """
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        if not uuid_parque_eolico:
            return Response({'error': 'uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filtrar la última inspección por parque eólico
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico).latest('fecha_inspeccion')
            serializer = self.get_serializer(ultima_inspeccion)
            return Response({'ultima_inspeccion': serializer.data}, status=status.HTTP_200_OK)
        except Inspeccion.DoesNotExist:
            return Response({'error': 'No se encontró inspección'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='ultima-proxima-inspeccion-parque-eolico')
    def ultima_proxima_inspeccion(self, request):
        """
        Obtener la última inspección pasada y la próxima inspección futura de un parque eólico en específico
        """
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        if not uuid_parque_eolico:
            return Response({'error': 'uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Última inspección (más reciente en el pasado)
        try:
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico).latest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            ultima_inspeccion = None

        # Próxima inspección (la más cercana en el futuro)
        try:
            proxima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico, fecha_inspeccion__gt=ultima_inspeccion.fecha_inspeccion).earliest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            proxima_inspeccion = None

        data = {
            'ultima_inspeccion': self.get_serializer(ultima_inspeccion).data if ultima_inspeccion else None,
            'proxima_inspeccion': self.get_serializer(proxima_inspeccion).data if proxima_inspeccion else None
        }
        return Response(data, status=status.HTTP_200_OK)

    # Obtener última inspección por parques eólicos para una empresa específica
    # Obtener última inspección por parques eólicos para una empresa específica
    @action(detail=False, methods=['get'], url_path='ultima-inspeccion-por-empresa')
    def ultima_inspeccion_por_empresa(self, request):
        """
        Obtener la última inspección para cada parque eólico de una empresa específica.
        """
        uuid_empresa = request.query_params.get('uuid_empresa')

        if not uuid_empresa:
            return Response({'error': 'uuid_empresa es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar parques eólicos por la empresa
        parques = ParquesEolicos.objects.filter(uuid_empresa=uuid_empresa)
        inspecciones = []

        for parque in parques:
            try:
                # Obtener la última inspección para cada parque eólico
                ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=parque.uuid_parque_eolico).latest('fecha_inspeccion')
                inspecciones.append(ultima_inspeccion)
            except Inspeccion.DoesNotExist:
                # Si no hay inspección, omitir este parque
                continue

        # Serializar y devolver las últimas inspecciones de cada parque de la empresa
        serializer = self.get_serializer(inspecciones, many=True)
        return Response({'ultimas_inspecciones': serializer.data}, status=status.HTTP_200_OK)

    #Obtener informacion de la ultima inspeccion por parque eolico
    @action(detail=False, methods=['get'], url_path='informacion-ultima-inspeccion')
    def informacion_ultima_inspeccion(self, request):
        """
        Obtener la información de la última inspección por parque eólico
        """
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        if not uuid_parque_eolico:
            return Response({'error': 'uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filtrar la última inspección por parque eólico
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico).latest('fecha_inspeccion')
            serializer = self.get_serializer(ultima_inspeccion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Inspeccion.DoesNotExist:
            return Response({'error': 'No se encontró inspección'}, status=status.HTTP_404_NOT_FOUND)
