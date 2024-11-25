from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ComponenteAerogenerador
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from estadoComponentes.models import EstadoComponente
from aerogeneradores.models import Aerogenerador
from parquesEolicos.models import ParquesEolicos


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



    # Obtener el tipo de un componente por su uuid unico
    @action(detail=False, methods=['get'], url_path='tipo-componente')
    def tipo_componente(self,request):
        """
        Obtiene el tipo del componente en base a su identificador unico
        """

        uuid_componente_url = request.query_params.get('uuid_componente')

        if not uuid_componente_url:
            return Response({'error': 'Parámetro uuid_componente es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        componente = ComponenteAerogenerador.objects.filter(uuid_componente=uuid_componente_url).first()

        if componente:
            return Response({'tipo_componente': componente.tipo_componente}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No se encontró componente'}, status=status.HTTP_404_NOT_FOUND)




    # Obtener todos los componentes de un aerogenerador
    @action(detail=False, methods=['get'], url_path='componentes-por-aerogenerador')
    def componentes_por_aerogenerador(self, request):
        """
        Listar todos los componentes de un aerogenerador
        """

        # Obtener parámetros de la URL
        uuid_aerogenerador_url = request.query_params.get('uuid_aerogenerador')

        # Validar que los parámetros no sean nulos
        if not uuid_aerogenerador_url:
            return Response({'error': 'Parámetro uuid_aerogenerador es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar los componentes por aerogenerador
        componentes = ComponenteAerogenerador.objects.filter(uuid_aerogenerador=uuid_aerogenerador_url)

        componentes_list = []
        for componente in componentes:
            componentes_list.append({
                'uuid_componente': str(componente.uuid_componente),  # Convertir UUID a cadena
                'tipo_componente': componente.tipo_componente
            })

        return Response(componentes_list, status=status.HTTP_200_OK)
