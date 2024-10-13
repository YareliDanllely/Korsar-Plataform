from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Aerogenerador
from .serializers import AerogeneradorSerializer
from estadoAerogeneradores.models import EstadoAerogenerador

class AerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = Aerogenerador.objects.all()
    serializer_class = AerogeneradorSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    # Obtener listado de todos los aerogeneradores con su estado final, por parque e inspección en específico
    @action(detail=False, methods=['get'], url_path='estado-por-inspeccion')
    def listar_por_parque_inspeccion(self, request):
        """
        Listar todos los aerogeneradores con su estado final, por parque e inspección en específico
        """
        # Obtener los parámetros de la URL
        uuid_parque_eolico_url = request.query_params.get('uuid_parque_eolico')
        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        # Validar que los parámetros no sean nulos
        if not uuid_parque_eolico_url or not uuid_inspeccion_url:
            return Response({'error': 'Parámetros uuid_parque_eolico y uuid_inspeccion son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar los aerogeneradores por parque
        aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=uuid_parque_eolico_url)

        # Filtrar el estado final de los aerogeneradores por inspección
        aerogeneradores_con_estado = []
        for aerogenerador in aerogeneradores:
            # Obtener el estado final del aerogenerador en la inspección
            estado_final = EstadoAerogenerador.objects.filter(uuid_aerogenerador=aerogenerador.uuid_aerogenerador, uuid_inspeccion=uuid_inspeccion_url).first()

            # Si existe un estado lo agregamos a la lista
            if estado_final:
                aerogeneradores_con_estado.append({
                    'uuid_aerogenerador': aerogenerador.uuid_aerogenerador,
                    'numero_aerogenerador': aerogenerador.numero_aerogenerador,
                    'estado_final': estado_final.estado_final_clasificacion,
                    'progreso': estado_final.progreso
                })

        return Response(aerogeneradores_con_estado, status=status.HTTP_200_OK)
