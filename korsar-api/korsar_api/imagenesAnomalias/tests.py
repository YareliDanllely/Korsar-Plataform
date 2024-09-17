from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from usuarios.models import Usuario  # Modelo de usuario personalizado
from .models import Imagen, ImagenAnomalia, Anomalia
from aerogeneradores.models import Aerogenerador
from componentesAerogenerador.models import ComponenteAerogenerador
from parquesEolicos.models import ParquesEolicos
from estadoAerogeneradores.models import EstadoAerogenerador
from inspecciones.models import Inspeccion
import uuid
class ImagenTests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba (técnico)
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

        # Crear un parque de prueba
        self.parque = ParquesEolicos.objects.create(
            uuid_parque=uuid.uuid4(),
            nombre_parque='Parque de Prueba',
            ubicacion_comuna='Comuna Prueba',
            ubicacion_region='Región Prueba',
            cantidad_turbinas=10,
            potencia_instalada=50.0,
            coordenada_longitud=-70.123,
            coordenada_latitud=-33.456
        )

        # Crear una inspección de prueba asociada al parque
        self.inspeccion = Inspeccion.objects.create(
            uuid_inspeccion=uuid.uuid4(),
            uuid_parque=self.parque,
            fecha_inspeccion='2024-09-15',
            fecha_siguiente_inspeccion='2025-09-15',
            progreso='Completado'
        )

        # Crear un aerogenerador de prueba
        self.aerogenerador = Aerogenerador.objects.create(
            uuid_aerogenerador=uuid.uuid4(),
            uuid_parque=self.parque,
            uuid_ultimo_estado=None,  # Estado no asignado (nulo)
            numero_aerogenerador=1,
            modelo_aerogenerador='Modelo 1',
            fabricante_aerogenerador='Fabricante A',
            altura_aerogenerador=100.0,
            diametro_rotor=50.0,
            potencia_nominal=3.0,
            coordenada_longitud=-70.567,
            coordenada_latitud=-33.678
        )

        # Crear un estado de prueba para el componente
        self.estado_componente = EstadoAerogenerador.objects.create(
            uuid_estado=uuid.uuid4(),
            estado_final_clasificacion='Reparado',
            progreso='Completado',
            uuid_aerogenerador=self.aerogenerador,
            uuid_inspeccion=self.inspeccion
        )

        # Crear un componente de prueba relacionado con el aerogenerador
        self.componente = ComponenteAerogenerador.objects.create(
            uuid_componente=uuid.uuid4(),
            uuid_aerogenerador=self.aerogenerador,
            uuid_ultimo_estado=self.estado_componente,
            tipo_componente='Rotor',
            coordenada_longitud=-70.567,
            coordenada_latitud=-33.678,
            ruta_imagen_visualizacion_componente='/imagenes/rotor.jpg'
        )

        # Crear una imagen de prueba
        self.imagen = Imagen.objects.create(
            uuid_imagen=uuid.uuid4(),
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,
            uuid_inspeccion=self.inspeccion,
            nombre_imagen='imagen1.jpg',
            fecha_creacion='2024-09-15',
            ruta_imagen='/imagenes/imagen1.jpg'
        )

        # Crear una anomalía de prueba
        self.anomalia = Anomalia.objects.create(
            uuid_anomalia=uuid.uuid4(),
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,
            codigo_anomalia='A001',
            severidad_anomalia=5,
            dimension_anomalia='10x10',
            orientacion_anomalia='Noroeste',
            descripcion_anomalia='Fisura en la pala del rotor.',
            observacion_anomalia='Debe repararse urgentemente.',
            coordenada_x=-70.567,
            coordenada_y=-33.678,
            uuid_inspeccion=self.inspeccion,
            uuid_tecnico=self.tecnico
        )

        # Relacionar la imagen con la anomalía
        self.imagen_anomalia = ImagenAnomalia.objects.create(
            uuid_imagen_anomalia = uuid.uuid4(),
            uuid_imagen=self.imagen,
            uuid_anomalia=self.anomalia
        )

    def test_obtener_imagenes_por_anomalia(self):
        # Definimos la URL para obtener las imágenes asociadas a la anomalía
        url = reverse('imagenanomalia-listar-imagenes-por-anomalia', kwargs={'pk': str(self.anomalia.uuid_anomalia)})

        # Hacemos la solicitud GET
        response = self.client.get(url)

        # Verificamos que la respuesta sea correcta
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificamos que haya al menos una imagen en la respuesta
        self.assertEqual(len(response.data), 1)

        # Verificamos que la imagen retornada sea la que hemos creado
        self.assertEqual(response.data[0]['uuid_imagen'], str(self.imagen.uuid_imagen))
