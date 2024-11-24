from rest_framework.permissions import BasePermission

class IsTechnicianOrClient(BasePermission):
    """
    Permiso que permite a técnicos realizar cualquier acción,
    y a clientes únicamente realizar GET.
    """
    def has_permission(self, request, view):
        # Permitir acceso a la vista de token (inicio de sesión)
        if view.__class__.__name__ == 'TokenObtainPairView':
            return True

        if not request.user.is_authenticated:
            return False

        if request.user.tipo_usuario == 1:  # Técnico
            return True

        if request.user.tipo_usuario == 2:  # Cliente
            return request.method in ['GET']

        return False

    def has_object_permission(self, request, view, obj):
        # Técnicos pueden acceder a todo
        if request.user.tipo_usuario == 1:
            return True

        # Clientes solo pueden acceder a sus propios datos
        if request.user.tipo_usuario == 2:
            return True
            # # Verificar si el modelo tiene el metotodo belongs_to_user
            # if hasattr(obj, 'belongs_to_user'):
            #     return obj.belongs_to_user(request.user.uuid_empresa)

        return False
