from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from inspecciones.models import Inspeccion
from parquesEolicos.models import ParquesEolicos
from usuarios.models import Usuario
from empresas.models import Empresa



class InspeccionViewSetTestCase(APITestCase):
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

        # definir un parque eolico
        self.parque = ParquesEolicos.objects.create(
            nombre_parque="Parque Eólico Test",
            ubicacion_comuna="Comuna Test",
            ubicacion_region="Región Test",
            cantidad_turbinas=5,
            potencia_instalada=10.0,
            coordenada_longitud=-70.0,
            coordenada_latitud=-30.0,
            uuid_empresa=self.empresa
        )


        # definir inspeccion

        self.inspeccion = Inspeccion.objects.create(
            uuid_inspeccion=uuid4(),
            uuid_parque_eolico=self.parque,
            fecha_inspeccion="2021-08-08",
            fecha_siguiente_inspeccion="2022-09-08",
            progreso="En proceso"
        )

        self.inspeccion_2 = Inspeccion.objects.create(
            uuid_inspeccion=uuid4(),
            uuid_parque_eolico=self.parque,
            fecha_inspeccion="2021-06-08",
            fecha_siguiente_inspeccion="2022-01-08",
            progreso="En proceso"

        )


    def test_get_ultima_inspeccion(self):
        """
        Probar que el endpoint retorne correctamente la última inspección de un parque eólico.
        Se validan el estado de la respuesta, los datos devueltos y la consistencia de la inspección.
        """
        # Definir la URL para el endpoint de obtención de la última inspección
        url = reverse('inspeccion-ultima-inspeccion-parque')



        # Hacer la solicitud GET con el UUID del parque
        response = self.client.get(url, {'uuid_parque_eolico': str(self.parque.uuid_parque_eolico)})

        # Verificar que el estado de la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta contiene la inspección
        self.assertIn('ultima_inspeccion', response.data, "La respuesta no contiene la clave 'ultima_inspeccion'")

        # Verificar que el UUID de la última inspección es correcto
        self.assertEqual(
            response.data['ultima_inspeccion']['uuid_inspeccion'],
            str(self.inspeccion.uuid_inspeccion),
            "El UUID de la última inspección no coincide con el esperado"
        )

        # Verificar que los datos de la inspección contienen los campos esperados
        expected_fields = ['uuid_inspeccion', 'fecha_inspeccion', 'fecha_siguiente_inspeccion', 'progreso']
        for field in expected_fields:
            self.assertIn(field, response.data['ultima_inspeccion'], f"El campo '{field}' no está presente en la inspección")

        # Validar que las fechas sean las correctas
        self.assertEqual(response.data['ultima_inspeccion']['fecha_inspeccion'], str(self.inspeccion.fecha_inspeccion))
        self.assertEqual(response.data['ultima_inspeccion']['fecha_siguiente_inspeccion'], str(self.inspeccion.fecha_siguiente_inspeccion))

        # Verificar que el progreso de la inspección es el correcto
        self.assertEqual(response.data['ultima_inspeccion']['progreso'], self.inspeccion.progreso)


    def test_get_ultima_proxima_inspeccion(self):
        """
        Probar que el endpoint retorne correctamente tanto la última inspección como la próxima inspección de un parque eólico.
        Se validan el estado de la respuesta, los datos devueltos y la consistencia de las inspecciones.
        """
        # Definir la URL para el endpoint de obtención de la última y próxima inspección
        url = reverse('inspeccion-ultima-proxima-inspeccion')



        # Hacer la solicitud GET con el UUID del parque
        response = self.client.get(url, {'uuid_parque_eolico': str(self.parque.uuid_parque_eolico)})

        # Verificar que el estado de la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta contiene tanto la última como la próxima inspección
        self.assertIn('ultima_inspeccion', response.data, "La respuesta no contiene la clave 'ultima_inspeccion'")
        self.assertIn('proxima_inspeccion', response.data, "La respuesta no contiene la clave 'proxima_inspeccion'")

        # Verificar que el UUID de la última inspección es correcto
        self.assertEqual(
            response.data['ultima_inspeccion']['uuid_inspeccion'],
            str(self.inspeccion.uuid_inspeccion),
            "El UUID de la última inspección no coincide con el esperado"
        )

        # Verificar que los datos de la próxima inspección son correctos (si existe una próxima inspección)
        if 'proxima_inspeccion' in response.data and response.data['proxima_inspeccion']:
            self.assertEqual(
                response.data['proxima_inspeccion']['fecha_inspeccion'],
                str(self.inspeccion.fecha_siguiente_inspeccion),
                "La fecha de la próxima inspección no coincide con la esperada"
            )
