from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from usuarios.models import Usuario  # Modelo de usuario personalizado
from .models import Imagen, Aerogenerador, ComponenteAerogenerador
from parquesEolicos.models import ParquesEolicos
from estadoAerogeneradores.models import EstadoAerogenerador
from inspecciones.models import Inspeccion
import uuid

class ImagenTests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba (técnico) usando el modelo de usuario personalizado
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

    def test_listar_imagenes(self):
        url = reverse('imagenes-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_crear_imagen(self):
        url = reverse('imagenes-list')
        data = {
            'uuid_aerogenerador': str(self.aerogenerador.uuid_aerogenerador),
            'uuid_componente': str(self.componente.uuid_componente),
            'uuid_inspeccion': str(self.inspeccion.uuid_inspeccion),
            'nombre_imagen': 'imagen2.jpg',
            'fecha_creacion': '2024-09-16',
            'ruta_imagen': '/imagenes/imagen2.jpg',
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Imagen.objects.count(), 2)

    def test_filtrar_imagenes_por_aerogenerador_componente_parque(self):
        url = reverse('imagenes-filtradas')

        response = self.client.get(url, {
            'turbina': str(self.aerogenerador.uuid_aerogenerador),
            'componente': str(self.componente.uuid_componente),
            'parque': str(self.parque.uuid_parque)
        })


        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filtro_sin_parametros(self):
        url = reverse('imagenes-filtradas')
        response = self.client.get(url, {
            'turbina': str(self.aerogenerador.uuid_aerogenerador),
            # Falta 'componente' y 'parque'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

def test_cambiar_clasificacion_a_sin_dano(self):
        # Cambiar el estado de clasificación de la imagen
        url = reverse('imagenes-cambiar-clasificacion', kwargs={'pk': self.imagen.pk})

        # Cambiar el estado de clasificación a 'sin_dano'
        data = {
            'estado_clasificacion': 'sin_dano'
        }

        # Enviar solicitud
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['estado_clasificacion'], 'sin_dano')

        # Verificar que el estado de clasificación haya sido actualizado
        self.imagen.refresh_from_db()
        self.assertEqual(self.imagen.estado_clasificacion, 'sin_dano')

def test_cambiar_clasificacion_invalida(self):
    # Intentar cambiar el estado de clasificación a un valor no válido
    url = reverse('imagenes-cambiar-clasificacion', kwargs={'pk': self.imagen.pk})

    data = {
        'estado_clasificacion': 'invalido'  # Clasificación no válida
    }

    # Enviar solicitud
    response = self.client.post(url, data, format='json')

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.data['estado_clasificacion'], 'Clasificación no válida')
