from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from parquesEolicos.serializers import ParqueEolicoSerializer
from parquesEolicos.models import ParquesEolicos
from usuarios.models import Usuario
from empresas.models import Empresa

class ComponenteAerogeneradorViewSetTestCase(APITestCase):

    def setUp(self):
        """
        Configurar instancias comunes para las pruebas
        """
        # Crear la empresa
        self.empresa = Empresa.objects.create(
            uuid_empresa=uuid4(),
            nombre_empresa="Empresa Test"
        )

        # Crear el usuario técnico
        self.tecnico = Usuario.objects.create_user(
            username='tecnico1',
            password='password123',
            tipo_usuario=1,  # Técnico
            uuid_empresa=self.empresa
        )

        # Obtener el token JWT
        url = reverse('token_obtain_pair')
        data = {
            'username': 'tecnico1',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']

        # Autenticar las solicitudes con el token JWT
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # crear una empresa
        self.empresa = Empresa.objects.create(
            nombre_empresa="Empresa Test"
        )

        self.parque_1= ParquesEolicos.objects.create(
            nombre_parque="Parque Eólico Test",
            ubicacion_comuna="Comuna Test",
            ubicacion_region="Región Test",
            cantidad_turbinas=5,
            potencia_instalada=10.0,
            coordenada_longitud=-70.0,
            coordenada_latitud=-30.0,
            uuid_empresa=self.empresa
        )

        self.parque_2= ParquesEolicos.objects.create(
            nombre_parque="Parque Eólico Test 2",
            ubicacion_comuna="Comuna Test 2",
            ubicacion_region="Región Test 2",
            cantidad_turbinas=5,
            potencia_instalada=10.0,
            coordenada_longitud=-70.0,
            coordenada_latitud=-30.0,
            uuid_empresa=self.empresa
        )


    def test_get_parques_de_empresa(self):
        """
        Probar si el endpoint devuelve correctamente los parques asociados a una empresa.
        """
        url = reverse('empresa-get-parques-de-empresa', args=[self.empresa.pk])
        response = self.client.get(url)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Serializar los parques esperados
        parques = self.empresa.parques.all()
        serializer = ParqueEolicoSerializer(parques, many=True)

        # Verificar que la respuesta contenga los parques esperados
        self.assertEqual(response.data, serializer.data)

