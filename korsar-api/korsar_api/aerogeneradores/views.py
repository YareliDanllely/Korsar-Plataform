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
                    'coordenada_latitud': aerogenerador.coordenada_latitud,
                    'coordenada_longitud': aerogenerador.coordenada_longitud
                })

        return Response(aerogeneradores_con_estado, status=status.HTTP_200_OK)

    # Obtener el número de un aerogenerador basado en su UUID
    @action(detail=False, methods=['get'], url_path='numero-aerogenerador')
    def obtener_numero_aerogenerador(self, request):
        uuid_aerogenerador = request.query_params.get('uuid_aerogenerador')

        if not uuid_aerogenerador:
            return Response({'error': 'El parámetro uuid_aerogenerador es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            aerogenerador = Aerogenerador.objects.get(pk=uuid_aerogenerador)
            return Response({'numero_aerogenerador': aerogenerador.numero_aerogenerador}, status=status.HTTP_200_OK)
        except Aerogenerador.DoesNotExist:
            return Response({'error': 'Aerogenerador no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Obtener el estado final de clasificacion de un aerogenerador por inspeccion y aerogenerador
    @action(detail=False, methods=['get'], url_path='estado-final')
    def obtener_estado_final_aerogenerador(self, request):
        uuid_aerogenerador = request.query_params.get('uuid_aerogenerador')
        uuid_inspeccion = request.query_params.get('uuid_inspeccion')

        if not uuid_aerogenerador or not uuid_inspeccion:
            return Response({'error': 'Los parámetros uuid_aerogenerador y uuid_inspeccion son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estado_final = EstadoAerogenerador.objects.get(uuid_aerogenerador=uuid_aerogenerador, uuid_inspeccion=uuid_inspeccion)
            return Response({'estado_final': estado_final.estado_final_clasificacion}, status=status.HTTP_200_OK)
        except EstadoAerogenerador.DoesNotExist:
            return Response({'error': 'Estado final no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Cambiar el estado final de clasificacion de un aerogeneador por inspeccion y aerogenerador
    @action(detail=False, methods=['put'], url_path='cambiar-estado-final')
    def cambiar_estado_final_aerogenerador(self,request):
        uuid_aerogenerador = request.data.get('uuid_aerogenerador')
        uuid_inspeccion = request.data.get('uuid_inspeccion')
        estado_final = request.data.get('estado_final')

        if not uuid_aerogenerador or not uuid_inspeccion or not estado_final:
            return Response({'error': 'Los parámetros uuid_aerogenerador, uuid_inspeccion y estado_final son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estado_aerogenerador = EstadoAerogenerador.objects.get(uuid_aerogenerador=uuid_aerogenerador, uuid_inspeccion=uuid_inspeccion)
            estado_aerogenerador.estado_final_clasificacion = estado_final
            estado_aerogenerador.save()
            return Response({'mensaje': 'Estado final actualizado'}, status=status.HTTP_200_OK)
        except EstadoAerogenerador.DoesNotExist:
            return Response({'error': 'Estado final no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Obtener la información de un aerogenerador por su UUID
    @action(detail=False, methods=['get'], url_path='informacion-aerogenerador')
    def obtener_info_aerogenerador(self, request):
        uuid_aerogenerador = request.query_params.get('uuid_aerogenerador')

        if not uuid_aerogenerador:
            return Response({'error': 'El parámetro uuid_aerogenerador es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            aerogenerador = Aerogenerador.objects.get(pk=uuid_aerogenerador)
            serializer = AerogeneradorSerializer(aerogenerador)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Aerogenerador.DoesNotExist:
            return Response({'error': 'Aerogenerador no encontrado'}, status=status.HTTP_404_NOT_FOUND)


        # Obtener todos los aerogeneradores de un parque
    @action(detail=False, methods=['get'], url_path='por-parque')
    def listar_por_parque(self, request):
        """
        Listar todos los aerogeneradores de un parque específico
        """
        # Obtener el parámetro uuid_parque_eolico
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        if not uuid_parque_eolico:
            return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar aerogeneradores por parque eólico
        aerogeneradores = Aerogenerador.objects.filter(uuid_parque_eolico=uuid_parque_eolico)

        # Serializar los datos
        serializer = self.get_serializer(aerogeneradores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
