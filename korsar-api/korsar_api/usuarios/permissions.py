from rest_framework.permissions import BasePermission

class AccesoEmpresa(BasePermission):
    """
    Permite acceso completo a los técnicos y controla el acceso de los clientes basado en su empresa.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_tecnico:
            return True  # Los técnicos tienen acceso a todos los objetos

        if request.user.is_cliente:
            # Verifica si el cliente tiene acceso a la empresa asociada al objeto
            return obj.usuario_tiene_acceso(request.user.uuid_usuario)

        return False
