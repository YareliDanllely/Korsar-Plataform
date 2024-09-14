from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import IsTechnician  # Importar el permiso correcto

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, IsTechnician]  # Aplicar permiso para asegurar que solo técnicos accedan

    def get_queryset(self):
        # Si el usuario es cliente, solo puede ver su propio perfil
        if self.request.user.tipo_usuario == 2:  # Cliente
            return Usuario.objects.filter(id=self.request.user.id)
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
