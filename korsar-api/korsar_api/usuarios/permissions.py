from rest_framework.permissions import BasePermission

class IsTechnicianOrReadOnlyForClient(BasePermission):
    """
    Permiso que permite a técnicos realizar cualquier acción,
    y a clientes únicamente realizar operaciones de lectura (GET).
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Técnicos tienen acceso total
        if request.user.is_tecnico:
            return True

        # Clientes solo tienen acceso de lectura
        if request.user.is_cliente:
            return request.method in ['GET']

        return False

    def has_object_permission(self, request, view, obj):
        # Técnicos tienen acceso total a cualquier objeto
        if request.user.is_tecnico:
            return True

        # Clientes pueden acceder a sus propios datos si se define `belongs_to_user` en el modelo
        if request.user.is_cliente:
            if hasattr(obj, 'belongs_to_user'):
                return obj.belongs_to_user(request.user.uuid_empresa)
            # Si no hay método definido, denegar por defecto
            return False

        return False
