from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from .serializers import ComponenteAerogeneradorSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from estadoComponentes.models import EstadoComponente

class ComponenteAerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definicion de las operaciones CRUD para los componentes de aerogenerador
    """

    queryset = ComponenteAerogenerador.objects.all()
    serializer_class = ComponenteAerogeneradorSerializer
    permission_classes = [IsAuthenticated]

    # vista para post clasificacion
    # Obtener listado de todos los componentes con su estado
    # asociado a un aerogenerador
    # en base a inspeccion a especfica
    @action(detail=False, methods=['get'], url_path='estado-por-inspeccion')
    def listar_por_aerogenerador_inspeccion(self, request):
        """
        Listar todos los componentes, con su estado final, por aerogenerador e inspeccion en especifico
        """

        # Obtener parametros de la URL
        uuid_aerogenerador_url = request.query_params.get('uuid_aerogenerador')
        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        # Validar que los parametros no sean nulos
        if not uuid_aerogenerador_url or not uuid_inspeccion_url:
            return Response({'error': 'Parametros uuid_aerogenerador y uuid_inspeccion son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtear los componentes por aerogenerador
        componentes = ComponenteAerogenerador.objects.filter(uuid_aerogenerador=uuid_aerogenerador_url)

        # Filtrar el estado final de los componentes por inspeccion
        componentes_con_estado = []
        for componentes in componentes:

            # Obtener el estado final del componente en la inspeccion
            estado_final = EstadoComponente.objects.filter(uuid_componente_aerogenerador=componentes.uuid_componente_aerogenerador, uuid_inspeccion=uuid_inspeccion_url).first()

            if estado_final:
                componentes_con_estado.append({
                    'uuid_componente_aerogenerador': componentes.uuid_componente_aerogenerador,
                    'nombre_componente': componentes.nombre_componente,
                    'estado_final': estado_final.estado_final_clasificacion
                    'progreso': estado_final.progreso
                })

        return Response(componentes_con_estado, status=status.HTTP_200_OK)
