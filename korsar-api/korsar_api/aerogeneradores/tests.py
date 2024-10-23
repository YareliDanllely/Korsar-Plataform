from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from .models import Aerogenerador
from estadoAerogeneradores.models import EstadoAerogenerador
from parquesEolicos.models import ParquesEolicos
from inspecciones.models import Inspeccion
from usuarios.models import Usuario
from empresas.models import Empresa

class AerogeneradorViewSetTestCase(APITestCase):

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

        # Crear el parque eólico
        self.parque = ParquesEolicos.objects.create(
            nombre_parque="Parque Eólico Test",
            abreviatura_parque="PET",
            ubicacion_comuna="Comuna Test",
            ubicacion_region="Región Test",
            cantidad_turbinas=5,
            potencia_instalada=10.0,
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

        # Crear aerogeneradores
        self.aerogenerador_1 = Aerogenerador.objects.create(
            uuid_parque_eolico=self.parque,
            numero_aerogenerador=1,
            modelo_aerogenerador="Modelo A",
            fabricante_aerogenerador="Fabricante X",
            altura_aerogenerador=100,
            diametro_rotor=80,
            potencia_nominal=2.5,
            coordenada_longitud=50.0,
            coordenada_latitud=30.0
        )

        self.aerogenerador_2 = Aerogenerador.objects.create(
            uuid_parque_eolico=self.parque,
            numero_aerogenerador=2,
            modelo_aerogenerador="Modelo B",
            fabricante_aerogenerador="Fabricante Y",
            altura_aerogenerador=110,
            diametro_rotor=85,
            potencia_nominal=3.0,
            coordenada_longitud=51.0,
            coordenada_latitud=31.0
        )

        # Crear estados finales para los aerogeneradores en la inspección
        self.estado_aerogenerador_1 = EstadoAerogenerador.objects.create(
            uuid_estado=uuid4(),
            uuid_aerogenerador=self.aerogenerador_1,
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Sin daño",
            progreso="Completado"
        )

        self.estado_aerogenerador_2 = EstadoAerogenerador.objects.create(
            uuid_estado=uuid4(),
            uuid_aerogenerador=self.aerogenerador_2,
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Reparación pendiente",
            progreso="En progreso"
        )

    def test_listar_por_parque_inspeccion(self):
        """
        Probar si el endpoint devuelve correctamente los aerogeneradores y sus estados finales
        filtrados por parque e inspección.
        """
        url = reverse('items-estado-por-inspeccion')

        # Hacer una solicitud GET con los parámetros uuid_parque y uuid_inspeccion
        params = {
            'uuid_parque_eolico': str(self.parque.uuid_parque),
            'uuid_inspeccion': str(self.inspeccion.uuid_inspeccion)
        }
        response = self.client.get(url, params)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se retornen 2 aerogeneradores con sus estados
        self.assertEqual(len(response.data), 2)

        # Verificar que los detalles del primer aerogenerador sean correctos
        self.assertEqual(str(response.data[0]['uuid_aerogenerador']), str(self.aerogenerador_1.uuid_aerogenerador))
        self.assertEqual(response.data[0]['numero_aerogenerador'], self.aerogenerador_1.numero_aerogenerador)
        self.assertEqual(response.data[0]['estado_final'], self.estado_aerogenerador_1.estado_final_clasificacion)
        self.assertEqual(response.data[0]['progreso'], self.estado_aerogenerador_1.progreso)

        # Verificar que los detalles del segundo aerogenerador sean correctos
        self.assertEqual(str(response.data[1]['uuid_aerogenerador']), str(self.aerogenerador_2.uuid_aerogenerador))
        self.assertEqual(response.data[1]['numero_aerogenerador'], self.aerogenerador_2.numero_aerogenerador)
        self.assertEqual(response.data[1]['estado_final'], self.estado_aerogenerador_2.estado_final_clasificacion)
        self.assertEqual(response.data[1]['progreso'], self.estado_aerogenerador_2.progreso)

    def test_obtener_numero_aerogenerador_exitoso(self):
        """
        Verificar que se puede obtener el número de un aerogenerador por UUID
        """
        url = reverse('items-numero-aerogenerador')  # Ajusta esta URL a tu configuración de rutas
        params = {
            'uuid_aerogenerador': str(self.aerogenerador_1.uuid_aerogenerador)
        }

        # Hacer la solicitud GET
        response = self.client.get(url, params)

        # Verificar que el estado sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el número del aerogenerador sea correcto
        self.assertEqual(response.data['numero_aerogenerador'], self.aerogenerador_1.numero_aerogenerador)

    def test_obtener_numero_aerogenerador_no_encontrado(self):
        """
        Verificar que el error 404 se devuelve si no se encuentra el aerogenerador
        """
        url = reverse('items-numero-aerogenerador')
        params = {
            'uuid_aerogenerador': str(uuid4())  # UUID aleatorio que no existe
        }

        # Hacer la solicitud GET
        response = self.client.get(url, params)

        # Verificar que el estado sea 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Aerogenerador no encontrado')

    def test_obtener_numero_aerogenerador_parametro_faltante(self):
        """
        Verificar que se devuelve un error si falta el parámetro uuid_aerogenerador
        """
        url = reverse('items-numero-aerogenerador')

        # Hacer la solicitud GET sin pasar el parámetro uuid_aerogenerador
        response = self.client.get(url)

        # Verificar que el estado sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'El parámetro uuid_aerogenerador es requerido')
