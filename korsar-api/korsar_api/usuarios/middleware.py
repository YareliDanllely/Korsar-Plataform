from django.shortcuts import redirect
from django.urls import reverse

class AdminAccessMiddleware:
    """
    Middleware para restringir el acceso al panel de administración a técnicos.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Revisar si el usuario está intentando acceder a /admin/
        if request.path.startswith('/admin/') and request.user.is_authenticated:
            # Solo permitir el acceso a usuarios técnicos
            if request.user.tipo_usuario != 1:  # 1: Técnico
                return redirect(reverse('no_access'))  # Redirige a una página de acceso denegado
