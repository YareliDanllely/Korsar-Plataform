from rest_framework.decorators import action
from rest_framework import viewsets
from .models import ParquesEolicos
from .serializers import ParqueEolicoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class ParqueEolicoViewSet(viewsets.ModelViewSet):
    """
    Definimos las acciones que se pueden realizar en el API para la entidad ParqueEolico
    """

    queryset = ParquesEolicos.objects.all()
    serializer_class = ParqueEolicoSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    @action(detail=False, methods=['get'], url_path='abreviatura-por-id')
    def obtener_abreviatura_por_id(self, request):
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        if not uuid_parque_eolico:
            return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parque = ParquesEolicos.objects.get(uuid_parque_eolico=uuid_parque_eolico)
            return Response({'abreviatura_parque': parque.abreviatura_parque}, status=status.HTTP_200_OK)
        except ParquesEolicos.DoesNotExist:
            return Response({'error': 'Parque eólico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
