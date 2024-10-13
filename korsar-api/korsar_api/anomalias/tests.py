from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from .models import Anomalia, Inspeccion, Usuario, Aerogenerador, ComponenteAerogenerador
from empresas.models import Empresa
from parquesEolicos.models import ParquesEolicos

class AnomaliaViewSetTestCase(APITestCase):

    def setUp(self):
        """
        Configuración de las instancias comunes para las pruebas
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

        # Crear una instancia de ParquesEolicos
        self.parque = ParquesEolicos.objects.create(
            nombre_parque="Parque Eólico Test",
            ubicacion_comuna="Comuna Test",
            ubicacion_region="Región Test",
            cantidad_turbinas=10,
            potencia_instalada=50.0,
            coordenada_longitud=-70.0,
            coordenada_latitud=-30.0,
            uuid_empresa=self.empresa
        )

        # Crear una inspección
        self.inspeccion = Inspeccion.objects.create(
            uuid_inspeccion=uuid4(),
            uuid_parque_eolico=self.parque,
            fecha_inspeccion="2024-09-01",
            fecha_siguiente_inspeccion="2025-09-01",
            progreso="Inspección Completada"
        )

        # Crear un aerogenerador
        self.aerogenerador = Aerogenerador.objects.create(
            uuid_parque_eolico=self.parque,
            numero_aerogenerador=1,
            modelo_aerogenerador="Modelo X",
            fabricante_aerogenerador="Fabricante Y",
            altura_aerogenerador=100,
            diametro_rotor=80,
            potencia_nominal=2.5,
            coordenada_longitud=50.0,
            coordenada_latitud=30.0
        )

        # Crear un componente para el aerogenerador
        self.componente = ComponenteAerogenerador.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            tipo_componente="Hélice",
            coordenada_longitud=50.0,
            coordenada_latitud=30.0,
            ruta_imagen_visualizacion_componente="imagen.jpg"
        )

        # Crear anomalías asociadas a la inspección
        self.anomalia_1 = Anomalia.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,  # Añadir el componente
            uuid_inspeccion=self.inspeccion,
            uuid_tecnico=self.tecnico,
            codigo_anomalia="A001",
            severidad_anomalia=3,
            descripcion_anomalia="Fisura",
            coordenada_x=50.5,
            coordenada_y=-30.4
        )
        self.anomalia_2 = Anomalia.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,  # Añadir el componente
            uuid_inspeccion=self.inspeccion,
            uuid_tecnico=self.tecnico,
            codigo_anomalia="A002",
            severidad_anomalia=2,
            descripcion_anomalia="Grieta",
            coordenada_x=50.6,
            coordenada_y=-30.5
        )

    def test_obtener_severidades_por_inspeccion(self):
        """
        Probar si el endpoint devuelve correctamente las severidades asociadas a una inspección.
        """
        url = reverse('anomalia-obtener-severidades-por-inspeccion')
        params = {'uuid_inspeccion': str(self.inspeccion.uuid_inspeccion)}

        response = self.client.get(url, params)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se retornan dos severidades
        self.assertEqual(len(response.data['severidades']), 2)
        self.assertIn(3, response.data['severidades'])
        self.assertIn(2, response.data['severidades'])



    def test_obtener_severidades_por_componente(self):
        """
        Probar si el endpoint 'severidades-por-componente' devuelve las severidades agrupadas por componente.
        """
        url = reverse('anomalia-obtener-severidades-por-componente')
        params = {'uuid_inspeccion': str(self.inspeccion.uuid_inspeccion)}

        response = self.client.get(url, params)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se retornan los resultados agrupados por componente
        resultados = response.data['resultados']


        self.assertEqual(len(resultados), 2)  # Un solo componente en esta prueba

        # Verificar que la severidad y el componente sean correctos
        self.assertEqual(resultados[0]['uuid_componente__tipo_componente'], self.componente.tipo_componente)
        self.assertEqual(resultados[0]['severidad_anomalia'], 2)



    def test_anomalias_filtradas_por_aerogenerador_componente_e_inspeccion(self):
        """
        Probar si el endpoint devuelve correctamente las anomalías filtradas por aerogenerador, componente e inspección.
        """
        url = reverse('anomalia-list')
        params = {
            'turbina': str(self.aerogenerador.uuid_aerogenerador),
            'componente': str(self.componente.uuid_componente),
            'inspeccion': str(self.inspeccion.uuid_inspeccion)
        }

        response = self.client.get(url, params)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se retornen 2 anomalías
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['codigo_anomalia'], "A001")
        self.assertEqual(response.data[1]['codigo_anomalia'], "A002")
