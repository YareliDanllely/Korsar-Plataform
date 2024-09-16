from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from usuarios.models import Usuario  # Modelo de usuario personalizado

class AutenticacionJWTTests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.tecnico = Usuario.objects.create_user(
            username='tecnico1',
            password='password123',
            tipo_usuario=1  # Técnico
        )

    def test_obtener_token_jwt(self):
        """
        Verificar que un usuario puede obtener un token JWT al iniciar sesión.
        """
        url = reverse('token_obtain_pair')  # Ruta para obtener el token JWT
        data = {
            'username': 'tecnico1',
            'password': 'password123'
        }

        # Enviar la solicitud de inicio de sesión con las credenciales
        response = self.client.post(url, data, format='json')

        # Verificar que el estado de la respuesta sea HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el token de acceso está presente en la respuesta
        self.assertIn('access', response.data)

    def test_fallo_de_autenticacion_con_credenciales_incorrectas(self):
        """
        Verificar que el inicio de sesión falla con credenciales incorrectas.
        """
        url = reverse('token_obtain_pair')
        data = {
            'username': 'tecnico1',
            'password': 'password_incorrecta'
        }

        # Enviar la solicitud con una contraseña incorrecta
        response = self.client.post(url, data, format='json')

        # Verificar que el estado de la respuesta sea HTTP 401 UNAUTHORIZED
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
