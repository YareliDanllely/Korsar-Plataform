from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Usuario
from .serializers import UsuarioSerializer




class CustomTokenObtainPairView(TokenObtainPairView):
   def post(self, request, *args, **kwargs):
    print("CustomTokenObtainPairView")
    try:
        response = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user

        response.data['user_id'] = str(user.uuid_usuario)
        response.data['empresa_id'] = str(user.uuid_empresa.uuid_empresa) if user.uuid_empresa else None
        response.data['username'] = user.username
        response.data['tipo_usuario'] = user.tipo_usuario

        print(f"Usuario autenticado: {user.username}")  # Log para depuración

        return response

    except Exception as e:
        print(f"Error autenticando usuario: {e}")  # Log para depuración
        return Response({"detail": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)



class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.tipo_usuario == 2:  # Cliente
            return Usuario.objects.filter(uuid_usuario=self.request.user.uuid_usuario)
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


