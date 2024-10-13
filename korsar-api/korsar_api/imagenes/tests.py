from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from .models import Aerogenerador, ComponenteAerogenerador, Inspeccion
from estadoComponentes.models import EstadoComponente
from anomalias.models import Anomalia
from usuarios.models import Usuario
from imagenes.models import Imagen
from empresas.models import Empresa
from imagenesAnomalias.models import ImagenAnomalia
from parquesEolicos.models import ParquesEolicos
from estadoAerogeneradores.models import EstadoAerogenerador

class ImagenTests(APITestCase):

    def setUp(self):
        """
        Configurar instancias comunes para pruebas
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
            uuid_parque_eolico=uuid4(),
            nombre_parque="Parque Eólico Test",
            ubicacion_comuna="Comuna Test",
            ubicacion_region="Región Test",
            cantidad_turbinas=10,
            potencia_instalada=50.0,
            coordenada_longitud=-70.0,
            coordenada_latitud=-30.0,
            uuid_empresa=self.empresa
        )

        # Crear datos de prueba para inspección
        self.inspeccion = Inspeccion.objects.create(
            uuid_inspeccion=uuid4(),
            uuid_parque_eolico=self.parque,
            fecha_inspeccion="2024-09-01",
            fecha_siguiente_inspeccion="2025-09-01",
            progreso="Inspección de prueba"
        )

        # Crear el aerogenerador
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

        # Crear una instancia de EstadoAerogenerador
        self.estadoAerogenerador = EstadoAerogenerador.objects.create(
            uuid_estado=uuid4(),
            uuid_aerogenerador=self.aerogenerador,
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

        # Crear una instancia de EstadoComponentes
        self.estado_componente = EstadoComponente.objects.create(
            uuid_componente=self.componente,
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Sin daño",
            progreso="Reparado"
        )

        # Crear una imagen asociada al aerogenerador
        self.imagen = Imagen.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            uuid_componente=self.componente,
            uuid_inspeccion=self.inspeccion,
            nombre_imagen="imagen_prueba.jpg",
            fecha_creacion="2024-09-16",
            ruta_imagen="ruta/a/imagen_prueba.jpg",
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

        # Crear una imagen de anomalía
        self.imagen_anomalia = ImagenAnomalia.objects.create(
            uuid_imagen=self.imagen,
            uuid_anomalia=self.anomalia
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
            'aerogeneradores': str(self.aerogenerador.uuid_aerogenerador),
            'componente': str(self.componente.uuid_componente),
            'parque_eolico': str(self.parque.uuid_parque_eolico)  # Aquí usa el campo correcto
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filtro_sin_parametros(self):
        url = reverse('imagenes-filtradas')
        response = self.client.get(url, {
            'aerogeneradores': str(self.aerogenerador.uuid_aerogenerador),
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
