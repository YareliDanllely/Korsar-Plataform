from rest_framework.decorators import action
from rest_framework import viewsets
from .models import ParquesEolicos
from .serializers import ParqueEolicoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import viewsets
from .models import ParquesEolicos
from .serializers import ParqueEolicoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class ParqueEolicoViewSet(viewsets.ModelViewSet):
    """
    API para manejar parques eólicos con lógica específica para técnicos y clientes.
    """
    queryset = ParquesEolicos.objects.all()  # Asegúrate de definir el queryset
    serializer_class = ParqueEolicoSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     """
    #     Filtra los datos según el tipo de usuario.
    #     """
    #     user = self.request.user
    #     if user.tipo_usuario == 1:  # Técnico
    #         return ParquesEolicos.objects.all()
    #     elif user.tipo_usuario == 2:  # Cliente
    #         return ParquesEolicos.objects.filter(uuid_empresa=user.uuid_empresa)
    #     return ParquesEolicos.objects.none()

    @action(detail=False, methods=['get'], url_path='parques-por-empresa')
    def obtener_parques_por_empresa(self, request):
        """
        Devuelve los parques eólicos asociados a una empresa seleccionada.
        """
        uuid_empresa = request.query_params.get('uuid_empresa')
        if not uuid_empresa:
            return Response({'error': 'El parámetro uuid_empresa es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parques = self.get_queryset().filter(uuid_empresa=uuid_empresa)

            if not parques.exists():
                return Response({'error': 'No se encontraron parques para la empresa seleccionada'}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(parques, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Ocurrió un error al obtener los parques: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='abreviatura-por-id')
    def obtener_abreviatura_por_id(self, request):
        """
        Devuelve la abreviatura de un parque dado su UUID.
        """
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')
        if not uuid_parque_eolico:
            return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parque = self.get_queryset().get(uuid_parque_eolico=uuid_parque_eolico)
            return Response({'abreviatura_parque': parque.abreviatura_parque}, status=status.HTTP_200_OK)
        except ParquesEolicos.DoesNotExist:
            return Response({'error': 'Parque eólico no encontrado'}, status=status.HTTP_404_NOT_FOUND)


# class ParqueEolicoViewSet(viewsets.ModelViewSet):
#     """
#     Definimos las acciones que se pueden realizar en el API para la entidad ParqueEolico
#     """

#     queryset = ParquesEolicos.objects.all()
#     serializer_class = ParqueEolicoSerializer
#     permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

#     #obtener abreviatura por id
#     @action(detail=False, methods=['get'], url_path='abreviatura-por-id')
#     def obtener_abreviatura_por_id(self, request):
#         uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

#         if not uuid_parque_eolico:
#             return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             parque = ParquesEolicos.objects.get(uuid_parque_eolico=uuid_parque_eolico)
#             return Response({'abreviatura_parque': parque.abreviatura_parque}, status=status.HTTP_200_OK)
#         except ParquesEolicos.DoesNotExist:
#             return Response({'error': 'Parque eólico no encontrado'}, status=status.HTTP_404_NOT_FOUND)

#     # obtener parques eolicos por empresa
#     @action(detail=False, methods=['get'], url_path='parques-eolicos-por-empresa')
#     def obtener_parques_eolicos_por_empresa(self, request):
#         uuid_empresa = request.query_params.get('uuid_empresa')  # Cambiado a uuid_empresa para ser consistente

#         if not uuid_empresa:
#             return Response({'error': 'El parámetro uuid_empresa es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             parques = ParquesEolicos.objects.filter(uuid_empresa=uuid_empresa)  # Asegúrate de que uuid_empresa exista en el modelo
#             serializer = ParqueEolicoSerializer(parques, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except ParquesEolicos.DoesNotExist:
#             return Response({'error': 'Parques eólicos no encontrados'}, status=status.HTTP_404_NOT_FOUND)


#     # Obtener informacion de un parque eolico por su uuid
#     @action(detail=False, methods=['get'], url_path='informacion-por-uuid')
#     def obtener_informacion_por_uuid(self, request):
#         uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

#         if not uuid_parque_eolico:
#             return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             parque = ParquesEolicos.objects.get(uuid_parque_eolico=uuid_parque_eolico)
#             serializer = self.get_serializer(parque)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except ParquesEolicos.DoesNotExist:
#             return Response({'error': 'Parque eólico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
