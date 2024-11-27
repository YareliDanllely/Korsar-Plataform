from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ImagenAnomalia, Imagen, Anomalia
from rest_framework.decorators import action
from rest_framework import status
from utils.validarAcceso import ValidarAcceso
from utils.utils import is_valid_uuid
from uuid import UUID
from imagenes.serializers import ImagenSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import ImagenAnomaliaSerializer

class ImagenAnomaliaViewSet(viewsets.ModelViewSet):
    """
    Definición de las operaciones CRUD para las imagenes de anomalias
    """
    queryset = ImagenAnomalia.objects.all()
    serializer_class = ImagenAnomaliaSerializer
    permission_classes = [IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder


#-----------------------------------------------------------------------------------------#


   # Obtener todas las imágenes asociadas a una anomalía
    @action(detail=True, methods=['get'], url_path='filtrar-anomalias')
    def listar_imagenes_por_anomalia(self, request, pk=None):
        """
        Obtener todas las imágenes asociadas a una anomalía
        """
        # Instanciar el validador
        validador = ValidarAcceso(request.user)

        try:
            validador.validar_pk(
                pk=pk,
                metodo_validacion = Anomalia.existe_anomalia_para_usuario)

            # Filtramos las imágenes por anomalía
            imagenes_anomalias = ImagenAnomalia.objects.filter(uuid_anomalia=pk)

            # Construimos el objeto de respuesta
            imagenes_data = [
                {
                    'uuid_imagen_anomalia': ia.uuid_imagen_anomalia,
                    'uuid_imagen': ia.uuid_imagen.uuid_imagen,
                    'ruta_imagen': ia.uuid_imagen.ruta_imagen,
                }
                for ia in imagenes_anomalias
            ]

            return Response(imagenes_data, status=status.HTTP_200_OK)

        # Manejo de excepciones
        except (Anomalia.DoesNotExist, ValueError) as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({'error': 'Error interno del servidor', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#-----------------------------------------------------------------------------------------#

    # Eliminar una imagen específica asociada a una anomalía
    @action(detail=False, methods=['post'], url_path='eliminar-imagenes')
    def eliminar_imagenes(self, request):
        """
        Eliminar múltiples imágenes asociadas a anomalías.
        Acceso restringido solo para técnicos.
        """
        # Verificar que el usuario sea técnico
        user = request.user
        if not user.is_tecnico:
            return Response({'detail': 'No tiene permiso para realizar esta acción.'}, status=status.HTTP_403_FORBIDDEN)

        # Obtener los IDs de las imágenes a eliminar
        imagenes_ids = request.data.get('imagenes_ids', [])
        if not imagenes_ids or not isinstance(imagenes_ids, list):
            return Response({'detail': 'Se debe proporcionar una lista de IDs de imágenes.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que los IDs sean UUID válidos
        imagenes_ids_validos = []
        for imagen_id in imagenes_ids:
            if not is_valid_uuid(imagen_id):
                return Response({'detail': f'El ID {imagen_id} no es un UUID válido.'}, status=status.HTTP_400_BAD_REQUEST)
            # Agregar el ID validado
            imagenes_ids_validos.append(imagen_id)

        try:
            # Filtrar las imágenes para eliminar
            imagenes_para_eliminar = ImagenAnomalia.objects.filter(uuid_imagen_anomalia__in=imagenes_ids_validos)

            # Verificar si hay imágenes para eliminar
            if not imagenes_para_eliminar.exists():
                return Response({'detail': 'No se encontraron imágenes válidas para eliminar.'}, status=status.HTTP_404_NOT_FOUND)

            # Eliminar las imágenes
            num_eliminadas, _ = imagenes_para_eliminar.delete()

            return Response({'detail': f'Se eliminaron {num_eliminadas} imágenes correctamente.'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'detail': f'Error al eliminar imágenes: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
