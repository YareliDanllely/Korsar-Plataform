from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import IsTechnician  # Importar el permiso correcto



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Llama al método post del padre para obtener la respuesta estándar de JWT
        response = super().post(request, *args, **kwargs)

        # Obtenemos el serializer y los datos validados
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Obtenemos el usuario desde los datos validados del serializer
        user = serializer.user  # Si esto no funciona, prueba con serializer.validated_data['user']

        # Agregar el user_id (o uuid_usuario si es personalizado) a la respuesta
        response.data['user_id'] = str(user.uuid_usuario)  # Usa 'id' o 'uuid_usuario', según tu modelo
        response.data['empresa_id'] = str(user.uuid_empresa.uuid_empresa) if user.uuid_empresa else None
        response.data['username'] = user.username  # Incluye el nombre de usuario
        response.data['tipo_usuario'] = user.tipo_usuario  # Incluye el tipo de usuario

        return response


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, IsTechnician]  # Aplicar permiso para asegurar que solo técnicos accedan

    def get_queryset(self):
        # Si el usuario es cliente, solo puede ver su propio perfil
        if self.request.user.tipo_usuario == 2:  # Cliente
            return Usuario.objects.filter(uuid_usuario=self.request.user.uuid_usuario)

        # Técnicos pueden ver a todos los usuarios
        return Usuario.objects.all()

    def create(self, request, *args, **kwargs):
        # Solo permitir la creación de usuarios a técnicos
        if request.user.tipo_usuario == 1:  # Técnico
            return super().create(request, *args, **kwargs)
        return Response({"detail": "No tiene permiso para agregar usuarios."},
                        status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        # Solo permitir la edición de usuarios a técnicos
        if request.user.tipo_usuario == 1:  # Técnico
            return super().update(request, *args, **kwargs)
        return Response({"detail": "No tiene permiso para editar usuarios."},
                        status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        # Solo permitir la eliminación de usuarios a técnicos
        if request.user.tipo_usuario == 1:  # Técnico
            return super().destroy(request, *args, **kwargs)
        return Response({"detail": "No tiene permiso para eliminar usuarios."},
                        status=status.HTTP_403_FORBIDDEN)


