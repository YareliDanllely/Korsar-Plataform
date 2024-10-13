from rest_framework.permissions import BasePermission

class IsTechnician(BasePermission):
    """
    Permiso que solo permite el acceso a los técnicos.
    Los clientes no tienen acceso a las acciones administrativas.
    """
    def has_permission(self, request, view):
        # Solo permitir a los técnicos (tipo_usuario = 1) acceder
        return request.user.is_authenticated and request.user.tipo_usuario == 1


class IsClient(BasePermission):
    """
    Permiso que permite a los clientes acceder solo a su propia información.
    """
    def has_permission(self, request, view):
        # Solo permitir a los clientes (tipo_usuario = 2) acceder
        if request.method in ['GET']:
            return request.user.is_authenticated and request.user.tipo_usuario == 2
        # Restringir otros métodos (POST, PUT, DELETE)
        return False

    def has_object_permission(self, request, view, obj):
        # Los clientes solo pueden acceder a su propia información de cliente
        if request.method in ['GET']:
            return obj.uuid_usuario == request.user.uuid_usuario
        return False
