from rest_framework.permissions import BasePermission

class IsTechnician(BasePermission):
    """
    Permiso que solo permite el acceso a los técnicos.
    Los clientes no tienen acceso a las acciones administrativas.
    """
    def has_permission(self, request, view):
        # Solo permitir a los técnicos (1) acceder
        return request.user.tipo_usuario == 1


class IsClient(BasePermission):
    """
    Permiso que permite a los clientes acceder solo a su propia información.
    """
    def has_permission(self, request):
        # Solo permitir a los clientes (2)
        return request.user.tipo_usuario == 2

    def has_object_permission(self, request, obj):
        # Los clientes solo pueden acceder a su propia información de cliente
        return obj.id_usuario == request.user
