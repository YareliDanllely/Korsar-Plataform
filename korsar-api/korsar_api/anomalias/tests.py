from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from uuid import UUID
from .models import Anomalia, Aerogenerador, ComponenteAerogenerador, Inspeccion, Usuario
from parquesEolicos.models import ParquesEolicos
from estadoAerogeneradores.models import EstadoAerogenerador

class AnomaliaViewSetTestCase(APITestCase):

    def setUp(self):
        """
        Crear objetos de prueba para Aerogenerador, Componente, Inspeccion, Usuario y Anomalia.
        """
        # Crear el usuario técnico
        self.tecnico = Usuario.objects.create_user(
            username='tecnico1',
            password='password123',
            tipo_usuario=1  # Técnico
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
            coordenada_latitud=-30.0
        )

        # Crear datos de prueba para inspección
        self.inspeccion = Inspeccion.objects.create(
            uuid_inspeccion=uuid4(),
            uuid_parque=self.parque,
            fecha_inspeccion="2024-09-01",
            fecha_siguiente_inspeccion="2025-09-01",
            progreso="Inspección de prueba"
        )

        # Crear el aerogenerador antes del estado
        self.aerogenerador = Aerogenerador.objects.create(
            uuid_parque=self.parque,
            numero_aerogenerador=1,
            modelo_aerogenerador="Modelo X",
            fabricante_aerogenerador="Fabricante Y",
            altura_aerogenerador=100,
            diametro_rotor=80,
            potencia_nominal=2.5,
            coordenada_longitud=50.0,
            coordenada_latitud=30.0
        )

        # Crear una instancia de EstadoAerogenerador después de que se haya creado el aerogenerador
        self.estadoAerogenerador = EstadoAerogenerador.objects.create(
            uuid_estado=uuid4(),
            uuid_aerogenerador=self.aerogenerador,  # Ahora el aerogenerador ya existe
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Sin daño",
            progreso="Completado"
        )

        # Crear datos de prueba para componente
        self.componente = ComponenteAerogenerador.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            tipo_componente="Hélice",
            coordenada_longitud=50.0,
            coordenada_latitud=30.0,
            ruta_imagen_visualizacion_componente="imagen.jpg"
        )

        # Crear una anomalía
        self.anomalia = Anomalia.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,
            uuid_inspeccion=self.inspeccion,
            uuid_tecnico=self.tecnico,
            codigo_anomalia="A001",
            severidad_anomalia=3,
            dimension_anomalia="10x5",
            orientacion_anomalia="Norte",
            descripcion_anomalia="Fisura en la hélice",
            observacion_anomalia="Requiere atención inmediata",
            coordenada_x=50.5,
            coordenada_y=-30.4
        )

def test_get_anomalias_filtradas(self):
    """
    Probar si la vista devuelve las anomalías filtradas por aerogenerador, componente e inspección.
    """
    url = reverse('anomalia-list')  # Asegúrate que este nombre coincide con el que usas en tus rutas

    # Parámetros para el filtro
    params = {
        'turbina': str(self.aerogenerador.uuid_aerogenerador),
        'componente': str(self.componente.uuid_componente),
        'inspeccion': str(self.inspeccion.uuid_inspeccion)
    }

    # Hacer una solicitud GET con los parámetros de consulta
    response = self.client.get(url, params)

    # Asegurarse de que la respuesta sea 200 OK
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Asegurarse de que se retorne la anomalía correcta
    self.assertEqual(len(response.data), 1)

    # Comparar los UUIDs como cadenas
    self.assertEqual(response.data[0]['uuid_aerogenerador'], str(self.aerogenerador.uuid_aerogenerador))
    self.assertEqual(response.data[0]['uuid_componente'], str(self.componente.uuid_componente))
    self.assertEqual(response.data[0]['uuid_inspeccion'], str(self.inspeccion.uuid_inspeccion))

def test_no_anomalias_if_wrong_filter(self):
    """
    Probar que no se devuelvan anomalías si se pasa un filtro incorrecto.
    """
    url = reverse('anomalia-list')

    # Filtro incorrecto para la turbina
    params = {
        'turbina': str(uuid4()),  # UUID que no existe
        'componente': str(self.componente.uuid_componente),
        'inspeccion': str(self.inspeccion.uuid_inspeccion)
    }

    # Hacer una solicitud GET con los parámetros incorrectos
    response = self.client.get(url, params)

    # Asegurarse de que no se retornen anomalías
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 0)
