import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from empresas.models import Empresa

class Usuario(AbstractUser):
    """
    Define el modelo de Usuario con UUID como clave primaria.
    """

    # Usar UUIDField como clave primaria
    uuid_usuario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    TIPO_USUARIO_CHOICES = (
        (1, 'Técnico'),
        (2, 'Cliente'),
    )

    tipo_usuario = models.IntegerField(choices=TIPO_USUARIO_CHOICES, default=2)
    uuid_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, null=True, blank=True)  # Permitir valores nulos
    telefono = models.CharField(max_length=20, blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuarios_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarios_user_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def is_tecnico(self):
        """Devuelve True si el usuario es Técnico."""
        return self.tipo_usuario == 1

    def is_cliente(self):
        """Devuelve True si el usuario es Cliente."""
        return self.tipo_usuario == 2

    def __str__(self):
        return self.username
