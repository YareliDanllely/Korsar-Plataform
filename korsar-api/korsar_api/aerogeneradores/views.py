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


    # Obtener listado de todos los aerogeneradors con su estado final, por parque e inspeccion en especifico
    @action(datail=False, methods=['get'], url_path='estado-por-inspeccion')
    def listar_por_parque_inspeccion(self, request):
        """
        Listar todos los aerogeneradores con su estado final, por parque e inspeccion en especifico
        """
        # Obtener los parametros de la URL
        uuid_parque_url = request.query_params.get('uuid_parque')
        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        # Validar que los parametros no sean nulos
        if not uuid_parque_url or not uuid_inspeccion_url:
            return Response({'error': 'Parametros uuid_parque y uuid_inspeccion son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtear los aerogeneradores por parque
        aerogeneradores = Aerogenerador.objects.filter(uuid_parque=uuid_parque_url)

        # Filtrar el estado final de los aerogeneradores por inspeccion
        aerogeneradores_con_estado = []
        for aerogeneradores in aerogeneradores:

            # Obtener el estado final del aerogenerador en la inspeccion
            estado_final = EstadoAerogenerador.objects.filter(uuid_aerogenerador=aerogeneradores.uuid_aerogenerador, uuid_inspeccion=uuid_inspeccion_url).first()

            #Si existe un estado lo agregamos a la cola
            if estado_final:
                aerogeneradores_con_estado.append({
                    'uuid_aerogenerador': aerogeneradores.uuid_aerogenerador,
                    'numero_aerogenerador': aerogeneradores.numero_aerogenerador,
                    'estado_final': estado_final.estado_final_clasificacion,
                    'progreso': estado_final.progreso
                })


        return Response(aerogeneradores_con_estado, status=status.HTTP_200_OK)

