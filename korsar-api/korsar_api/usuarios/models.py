from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    """
    Define el modelo de Usuario con sus componentes.
    """

    TIPO_USUARIO_CHOICES = (
        (1, 'Técnico'),
        (2, 'Cliente'),
    )

    tipo_usuario = models.IntegerField(choices=TIPO_USUARIO_CHOICES, default=2)
    nombre_empresa = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuarios_user_set',  # Cambia el related_name para evitar conflictos
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarios_user_permissions_set',  # Cambia el related_name para evitar conflictos
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username
