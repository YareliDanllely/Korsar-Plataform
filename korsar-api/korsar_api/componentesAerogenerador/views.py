from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from estadoComponentes.models import EstadoComponente



class ComponenteAerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = ComponenteAerogenerador.objects.all()
    serializer_class = ComponenteAerogenerador
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    # Obtener listado de todos los componentes con su estado final, por aerogenerador e inspección en específico
    @action(detail=False, methods=['get'], url_path='estado-por-inspeccion-aerogenerador')
    def listar_por_aerogenerador_inspeccion(self, request):
        """
        Listar todos los componentes, con su estado final, por aerogenerador e inspección en específico
        """

        # Obtener parámetros de la URL
        uuid_aerogenerador_url = request.query_params.get('uuid_aerogenerador')
        uuid_inspeccion_url = request.query_params.get('uuid_inspeccion')

        # Validar que los parámetros no sean nulos
        if not uuid_aerogenerador_url or not uuid_inspeccion_url:
            return Response({'error': 'Parámetros uuid_aerogenerador y uuid_inspeccion son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar los componentes por aerogenerador
        componentes = ComponenteAerogenerador.objects.filter(uuid_aerogenerador=uuid_aerogenerador_url)

        # Filtrar el estado final de los componentes por inspección
        componentes_con_estado = []
        for componente in componentes:
            # Obtener el estado final del componente en la inspección
            estado_final = EstadoComponente.objects.filter(uuid_componente=componente.uuid_componente, uuid_inspeccion=uuid_inspeccion_url).first()

            if estado_final:
                componentes_con_estado.append({
                    'uuid_componente': str(componente.uuid_componente),  # Convertir UUID a cadena
                    'tipo_componente': componente.tipo_componente,
                    'estado_final': estado_final.estado_final_clasificacion,
                    'progreso': estado_final.progreso
                })

        return Response(componentes_con_estado, status=status.HTTP_200_OK)
