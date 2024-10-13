from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from uuid import uuid4
from .models import ComponenteAerogenerador
from estadoComponentes.models import EstadoComponente
from aerogeneradores.models import Aerogenerador
from inspecciones.models import Inspeccion
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

        # Crear el parque eólico
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
            modelo_aerogenerador="Modelo A",
            fabricante_aerogenerador="Fabricante X",
            altura_aerogenerador=100,
            diametro_rotor=80,
            potencia_nominal=2.5,
            coordenada_longitud=50.0,
            coordenada_latitud=30.0
        )

        # Crear componentes para el aerogenerador
        self.componente_1 = ComponenteAerogenerador.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            tipo_componente="Hélice",
            coordenada_longitud=50.0,
            coordenada_latitud=30.0,
            ruta_imagen_visualizacion_componente="imagen1.jpg"
        )

        self.componente_2 = ComponenteAerogenerador.objects.create(
            uuid_aerogenerador=self.aerogenerador,
            tipo_componente="Generador",
            coordenada_longitud=51.0,
            coordenada_latitud=31.0,
            ruta_imagen_visualizacion_componente="imagen2.jpg"
        )

        # Crear estados para los componentes en la inspección
        self.estado_componente_1 = EstadoComponente.objects.create(
            uuid_componente=self.componente_1,
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Sin daño",
            progreso="Completado",
        )

        self.estado_componente_2 = EstadoComponente.objects.create(
            uuid_componente=self.componente_2,
            uuid_inspeccion=self.inspeccion,
            estado_final_clasificacion="Reparación pendiente",
            progreso="En progreso",


        )

    def test_listar_por_componentes_inspeccion(self):
        """
        Probar si el endpoint devuelve correctamente los componentes del aerogenerador con su estado final
        filtrados por aerogenerador e inspección.
        """
        url = reverse('componenteaerogenerador-listar-por-aerogenerador-inspeccion')

        # Hacer una solicitud GET con los parámetros uuid_aerogenerador y uuid_inspeccion
        params = {
            'uuid_aerogenerador': str(self.aerogenerador.uuid_aerogenerador),
            'uuid_inspeccion': str(self.inspeccion.uuid_inspeccion)
        }
        response = self.client.get(url, params)

        # Asegurarse de que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se retornen 2 componentes con sus estados
        self.assertEqual(len(response.data),2)

        # Verificar que los detalles del primer componente sean correctos
        self.assertEqual(response.data[0]['uuid_componente'], str(self.componente_1.uuid_componente))
        self.assertEqual(response.data[0]['tipo_componente'], self.componente_1.tipo_componente)
        self.assertEqual(response.data[0]['estado_final'], self.estado_componente_1.estado_final_clasificacion)
        self.assertEqual(response.data[0]['progreso'], self.estado_componente_1.progreso)

        # Verificar que los detalles del segundo componente sean correctos
        self.assertEqual(response.data[1]['uuid_componente'], str(self.componente_2.uuid_componente))
        self.assertEqual(response.data[1]['tipo_componente'], self.componente_2.tipo_componente)
        self.assertEqual(response.data[1]['estado_final'], self.estado_componente_2.estado_final_clasificacion)
        self.assertEqual(response.data[1]['progreso'], self.estado_componente_2.progreso)
