from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Inspeccion
from .serializers import InspeccionSerializer
from .models import ParquesEolicos
from anomalias.models import Anomalia
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from uuid import UUID
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from .models import Inspeccion, ParquesEolicos
from .serializers import InspeccionSerializer
from anomalias.models import Anomalia


class InspeccionViewSet(viewsets.ModelViewSet):
    """
    API para gestionar inspecciones, incluyendo lógica de consultas por parque y empresa.
    """
    queryset = Inspeccion.objects.all()
    serializer_class = InspeccionSerializer
    permission_classes = [IsAuthenticated]


    def retrieve(self, request, *args, **kwargs):
        """
        Obtener la información de una inspección por su UUID.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    @action(detail=False, methods=['get'], url_path='por-usuario')
    def inspecciones_por_usuario(self, request):
        """
        Retorna las inspecciones dependiendo del tipo de usuario autenticado.
        """
        user = request.user

        if user.is_tecnico():  # Usuario es Técnico
            # Técnicos obtienen todas las inspecciones
            inspecciones = Inspeccion.objects.all()

        elif user.is_cliente():  # Usuario es Cliente
            # Clientes obtienen inspecciones solo de su empresa
            print("---CLIENTE",user.uuid_empresa)
            if not user.uuid_empresa:
                return Response(
                    {"detail": "El usuario no está asociado a ninguna empresa."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Filtrar parques de la empresa del cliente
            parques = ParquesEolicos.objects.filter(uuid_empresa=user.uuid_empresa)


            # Filtrar inspecciones de esos parques
            inspecciones = Inspeccion.objects.filter(uuid_parque_eolico__in=parques).exclude(progreso=0)

        else:
            # Si el tipo de usuario no es válido
            return Response(
                {"detail": "El rol del usuario no está autorizado para esta acción."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Serializar y retornar inspecciones
        serializer = self.get_serializer(inspecciones, many=True)
        return Response(serializer.data)





    @action(detail=True, methods=['get'], url_path='ultima-y-proxima-inspeccion')
    def ultima_y_proxima_inspeccion(self, request, pk=None):
        """
        Devuelve la última inspección y la próxima inspección para un parque específico.
        """
        try:
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=pk).latest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            ultima_inspeccion = None

        try:
            proxima_inspeccion = Inspeccion.objects.filter(
                uuid_parque_eolico=pk,
                fecha_inspeccion__gt=(ultima_inspeccion.fecha_inspeccion if ultima_inspeccion else None)
            ).earliest('fecha_inspeccion')
        except Inspeccion.DoesNotExist:
            proxima_inspeccion = None

        data = {
            'ultima_inspeccion': self.get_serializer(ultima_inspeccion).data if ultima_inspeccion else None,
            'proxima_inspeccion': self.get_serializer(proxima_inspeccion).data if proxima_inspeccion else None
        }
        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='ultima-y-proxima-inspeccion-empresa')
    def ultima_y_proxima_inspeccion_empresa(self, request):
        """
        Devuelve las últimas y próximas inspecciones para todos los parques de una empresa.
        """
        # Obtener el uuid_empresa de los parámetros de la solicitud
        uuid_empresa = request.query_params.get('uuid_empresa')

        # Validar que se proporcione el uuid_empresa
        if not uuid_empresa:
            return Response({'error': 'uuid_empresa es requerido'}, status=status.HTTP_400_BAD_REQUEST)


        # Validar que el uuid_empresa sea un UUID válido
        try:
            uuid_empresa = UUID(uuid_empresa)  # Convertir a UUID
        except ValueError:
            return Response({'error': 'uuid_empresa no es un UUID válido'}, status=status.HTTP_400_BAD_REQUEST)


        # Validar si el usuario tiene acceso a la empresa
        if request.user.tipo_usuario == 2 and request.user.uuid_empresa.uuid_empresa != uuid_empresa:
            print("No tiene permiso")
            return Response({'error': 'No tienes permiso para acceder a esta empresa'}, status=status.HTTP_403_FORBIDDEN)


        # Filtrar los parques asociados a la empresa
        parques = ParquesEolicos.objects.filter(uuid_empresa__uuid_empresa=uuid_empresa)
        if not parques.exists():
            return Response({'message': 'No hay parques asociados a esta empresa'}, status=status.HTTP_200_OK)


        # Obtener inspecciones asociadas a los parquesssparques
        inspecciones = []
        for parque in parques:
            # Obtener la última inspección
            ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=parque).order_by('-fecha_inspeccion').first()
            print(f"Parque: {parque.nombre_parque}, Última inspección: {ultima_inspeccion.fecha_inspeccion}")

            # Agregar la información al resultado
            inspecciones.append({
                'uuid_parque_eolico': str(parque.uuid_parque_eolico),  # Convertimos UUID a string
                'uuid_inspeccion': str(ultima_inspeccion.uuid_inspeccion) if ultima_inspeccion else None,
                'fecha_inspeccion': ultima_inspeccion.fecha_inspeccion.isoformat() if ultima_inspeccion and ultima_inspeccion.fecha_inspeccion else None,
                'fecha_siguiente_inspeccion': ultima_inspeccion.fecha_siguiente_inspeccion.isoformat() if ultima_inspeccion and ultima_inspeccion.fecha_siguiente_inspeccion else None,
            })


        print(f"Inspecciones encontradas: {inspecciones}")
        return Response({'inspecciones': inspecciones}, status=status.HTTP_200_OK)





    @action(detail=False, methods=['post'], url_path='cambiar-progreso')
    def cambiar_progreso(self, request):
        """
        Cambiar el progreso de una inspección.
        Exclusiva de técnicos.
        """
        uuid_inspeccion = request.data.get('uuid_inspeccion')
        progreso = request.data.get('progreso')

        if not uuid_inspeccion:
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        if progreso is None:
            return Response({'error': 'progreso es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inspeccion = Inspeccion.objects.get(uuid_inspeccion=uuid_inspeccion)
            inspeccion.progreso = progreso
            inspeccion.save()

            return Response({'mensaje': 'Progreso actualizado correctamente'}, status=status.HTTP_200_OK)
        except Inspeccion.DoesNotExist:
            return Response({'error': 'Inspección no encontrada'}, status=status.HTTP_404_NOT_FOUND)





    @action(detail=False, methods=['get'], url_path='cantidad-severidades-por-componente')
    def cantidad_severidades_por_componente(self, request):
        """
        Obtener la cantidad de severidades por tipo de componente en una inspección,
        validando que el usuario tenga acceso a la inspección.
        """
        uuid_inspeccion = request.query_params.get('uuid_inspeccion')

        # Validar que se haya enviado `uuid_inspeccion`
        if not uuid_inspeccion:
            return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que `uuid_inspeccion` sea un UUID válido
        try:
            uuid_inspeccion = UUID(uuid_inspeccion)
        except ValueError:
            return Response({'error': 'uuid_inspeccion no es un UUID válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar inspección para asegurar acceso
        try:
            inspeccion = Inspeccion.objects.get(uuid_inspeccion=uuid_inspeccion)
        except Inspeccion.DoesNotExist:
            return Response({'error': 'La inspección no existe.'}, status=status.HTTP_404_NOT_FOUND)

        # Validar acceso del usuario a la inspección
        if request.user.tipo_usuario == 2 and inspeccion.uuid_parque_eolico.uuid_empresa != request.user.uuid_empresa:
            return Response({'error': 'No tienes permiso para acceder a esta empresa'}, status=status.HTTP_403_FORBIDDEN)

        # Obtener severidades
        severidades = (
            Anomalia.objects
            .filter(uuid_inspeccion=uuid_inspeccion)
            .values('ubicacion_componente', 'severidad_anomalia')
            .annotate(total_severidades=Count('severidad_anomalia'))
            .order_by('ubicacion_componente', 'severidad_anomalia')
        )

        # Procesar resultado
        respuesta = {}
        for item in severidades:
            ubicacion = dict(Anomalia.UBICACION_COMPONENTE_CHOICES).get(item['ubicacion_componente'], 'Desconocido')
            severidad = dict(Anomalia.SEVERIDAD_CHOICES).get(item['severidad_anomalia'], 'Desconocido')

            if ubicacion not in respuesta:
                respuesta[ubicacion] = {}

            respuesta[ubicacion][severidad] = item['total_severidades']

        return Response(respuesta, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='informacion-ultima-inspeccion')
    def informacion_ultima_inspeccion(self, request):
        """
        Obtener la información de la última inspección completada por parque eólico.
        """
        # Obtener el parámetro de la solicitud
        uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

        # Validar que el parámetro no sea nulo
        if not uuid_parque_eolico:
            return Response({'error': 'El parámetro uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filtrar la última inspección completada por parque eólico (excluyendo progreso=0)
            ultima_inspeccion = Inspeccion.objects.filter(
                uuid_parque_eolico=uuid_parque_eolico
            ).exclude(progreso=0).latest('fecha_inspeccion')

            # Serializar y retornar la información de la inspección
            serializer = self.get_serializer(ultima_inspeccion)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Inspeccion.DoesNotExist:
            return Response({'error': 'No se encontró ninguna inspección completada para el parque eólico indicado'},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class InspeccionViewSet(viewsets.ModelViewSet):
#     """
#     Definición de las operaciones CRUD para las inspecciones
#     """

#     queryset = Inspeccion.objects.all()
#     serializer_class = InspeccionSerializer
#     permission_classes = [IsAuthenticated]

#     @action(detail=False, methods=['get'], url_path='ultima-inspeccion-parque-eolico')
#     def ultima_inspeccion_parque(self, request):
#         """
#         Obtener la última inspección de un parque eólico en específico
#         """
#         uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

#         if not uuid_parque_eolico:
#             return Response({'error': 'uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Filtrar la última inspección por parque eólico
#             ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico).latest('fecha_inspeccion')
#             serializer = self.get_serializer(ultima_inspeccion)
#             return Response({'ultima_inspeccion': serializer.data}, status=status.HTTP_200_OK)
#         except Inspeccion.DoesNotExist:
#             return Response({'error': 'No se encontró inspección'}, status=status.HTTP_404_NOT_FOUND)

#     @action(detail=False, methods=['get'], url_path='ultima-proxima-inspeccion-parque-eolico')
#     def ultima_proxima_inspeccion(self, request):
#         """
#         Obtener la última inspección pasada y la próxima inspección futura de un parque eólico en específico
#         """
#         uuid_parque_eolico = request.query_params.get('uuid_parque_eolico')

#         if not uuid_parque_eolico:
#             return Response({'error': 'uuid_parque_eolico es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         # Última inspección (más reciente en el pasado)
#         try:
#             ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico).latest('fecha_inspeccion')
#         except Inspeccion.DoesNotExist:
#             ultima_inspeccion = None

#         # Próxima inspección (la más cercana en el futuro)
#         try:
#             proxima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=uuid_parque_eolico, fecha_inspeccion__gt=ultima_inspeccion.fecha_inspeccion).earliest('fecha_inspeccion')
#         except Inspeccion.DoesNotExist:
#             proxima_inspeccion = None

#         data = {
#             'ultima_inspeccion': self.get_serializer(ultima_inspeccion).data if ultima_inspeccion else None,
#             'proxima_inspeccion': self.get_serializer(proxima_inspeccion).data if proxima_inspeccion else None
#         }
#         return Response(data, status=status.HTTP_200_OK)

#     # Obtener última inspección por parques eólicos para una empresa específica
#     @action(detail=False, methods=['get'], url_path='ultima-inspeccion-por-empresa')
#     def ultima_inspeccion_por_empresa(self, request):
#         """
#         Obtener la última inspección para cada parque eólico de una empresa específica.
#         """
#         uuid_empresa = request.query_params.get('uuid_empresa')

#         if not uuid_empresa:
#             return Response({'error': 'uuid_empresa es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         # Filtrar parques eólicos por la empresa
#         parques = ParquesEolicos.objects.filter(uuid_empresa=uuid_empresa)
#         inspecciones = []

#         for parque in parques:
#             try:
#                 # Obtener la última inspección para cada parque eólico
#                 ultima_inspeccion = Inspeccion.objects.filter(uuid_parque_eolico=parque.uuid_parque_eolico).latest('fecha_inspeccion')
#                 inspecciones.append(ultima_inspeccion)
#             except Inspeccion.DoesNotExist:
#                 # Si no hay inspección, omitir este parque
#                 continue

#         # Serializar y devolver las últimas inspecciones de cada parque de la empresa
#         serializer = self.get_serializer(inspecciones, many=True)
#         return Response({'ultimas_inspecciones': serializer.data}, status=status.HTTP_200_OK)

#

#     #Cambiar progreso de inspeccion
#     @action(detail=False, methods=['post'], url_path='cambiar-progreso')
#     def cambiar_progreso(self, request):
#         """
#         Cambiar el progreso de una inspección
#         """

#         print(request.data)
#         uuid_inspeccion = request.data.get('uuid_inspeccion')
#         progreso = request.data.get('progreso')

#         if not uuid_inspeccion:
#             return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         if progreso is None:
#             return Response({'error': 'progreso es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Actualizar el progreso de la inspección
#             inspeccion = Inspeccion.objects.get(uuid_inspeccion=uuid_inspeccion)
#             inspeccion.progreso = progreso
#             inspeccion.save()

#             return Response({'mensaje': 'Progreso actualizado correctamente'}, status=status.HTTP_200_OK)

#         except Inspeccion.DoesNotExist:
#             return Response({'error': 'Inspección no encontrada'}, status=status.HTTP_404_NOT_FOUND)




#     @action(detail=False, methods=['get'], url_path='cantidad-severidades-por-componente')
#     def cantidad_severidades_por_componente(self, request):
#         """
#         Obtener la cantidad de severidades obtenidas en una inspección por tipo de componente
#         """
#         uuid_inspeccion = request.query_params.get('uuid_inspeccion')

#         if not uuid_inspeccion:
#             return Response({'error': 'uuid_inspeccion es requerido'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Filtrar las anomalías por el UUID de inspección y agrupar por ubicación de componente y severidad
#             severidades = (
#                 Anomalia.objects
#                 .filter(uuid_inspeccion=uuid_inspeccion)
#                 .values('ubicacion_componente', 'severidad_anomalia')
#                 .annotate(total_severidades=Count('severidad_anomalia'))
#                 .order_by('ubicacion_componente', 'severidad_anomalia')
#             )

#             # Reestructurar los datos en un formato de respuesta más claro
#             respuesta = {}
#             for item in severidades:
#                 ubicacion = dict(Anomalia.UBICACION_COMPONENTE_CHOICES).get(item['ubicacion_componente'], 'Desconocido')
#                 severidad = dict(Anomalia.SEVERIDAD_CHOICES).get(item['severidad_anomalia'], 'Desconocido')

#                 if ubicacion not in respuesta:
#                     respuesta[ubicacion] = {}

#                 respuesta[ubicacion][severidad] = item['total_severidades']

#             return Response(respuesta, status=status.HTTP_200_OK)

#         except Anomalia.DoesNotExist:
#             return Response({'error': 'No se encontraron anomalías para esta inspección'}, status=status.HTTP_404_NOT_FOUND)
