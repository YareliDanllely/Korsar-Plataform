from django.shortcuts import redirect
from django.urls import reverse

class AdminAccessMiddleware:
    """
    Middleware para restringir acceso al panel de administración a técnicos.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/') and request.user.is_authenticated:
            if request.user.tipo_usuario != 1:
                return redirect(reverse('no_access'))
        print("Middle Cliente")
        return self.get_response(request)
