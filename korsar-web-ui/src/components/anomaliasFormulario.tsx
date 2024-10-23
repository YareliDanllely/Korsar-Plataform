import React, { useEffect, useState } from 'react'; // Asegúrate de importar useEffect y useState
import { TextInput, Textarea, Button } from "flowbite-react"; // Importa Button para el envío
import SelectorCategoria from "./selectorCategoria";
import { DropZone } from "./dropZone"; // Importa el DropZone
import { obtenerSiguienteNumeroDano, crearAnomalia } from '../services/anomalias'; // Asegúrate de importar estas funciones
import { obtenerAbreviaturaParque } from '../services/parqueEolico';
import { obtenerNumeroAerogenerador } from '../services/aerogeneradores';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface FormularioAnomaliasProps {
  droppedImages: Imagen[]; // Recibe las imágenes desde el abuelo
  onRemoveImage: (imageId: string) => void; // Recibe la función para eliminar una imagen
  uuid_aerogenerador: string; // UUID del aerogenerador
  uuid_componente: string; // UUID del componente
  uuid_inspeccion: string;
  uuid_parque: string; // UUID del parque
}

export function FormularioAnomalias({ droppedImages, onRemoveImage, uuid_aerogenerador, uuid_componente, uuid_inspeccion, uuid_parque }: FormularioAnomaliasProps) {
  const [siguienteNumeroDano, setSiguienteNumeroDano] = useState<string>(''); // Estado para almacenar el siguiente número de daño
  const [abreviaturaParque, setAbreviaturaParque] = useState<string>(''); // Estado para almacenar la abreviatura del parque
  const [numeroAerogenerador, setNumeroAerogenerador] = useState<number>(0); // Estado para almacenar el número del aerogenerador
  const [codigoAnomalia, setCodigoAnomalia] = useState<string>(''); // Estado para almacenar el código de la anomalía
  const [categoriaDaño, setCategoriaDaño] = useState<number>(0);
  const [orientacionAnomalia, setOrientacionAnomalia] = useState<string>(''); // Estado para almacenar la orientación de la anomalía
  const [dimensionAnomalia, setDimensionAnomalia] = useState<string>(''); // Estado para almacenar la dimensión de la anomalía
  const [descripcionAnomalia, setDescripcionAnomalia] = useState<string>(''); // Estado para almacenar la descripción de la anomalía
  const [observacionAnomalia, setObservacionAnomalia] = useState<string>(''); // Estado para almacenar la observación de la anomalía
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    console.log(`User ID: ${storedUserId}`);
  }, []);

  useEffect(() => {
    const fetchSiguienteNumeroDano = async () => {
      try {
        const numero = await obtenerSiguienteNumeroDano(uuid_componente);
        setSiguienteNumeroDano(numero);
        console.log('Siguiente número de daño:', numero);
      } catch (error) {
        console.error('Error al obtener el siguiente número de daño:', error);
      }
    };

    if (uuid_componente) {
      fetchSiguienteNumeroDano();
    }
  }, [uuid_componente]);

  useEffect(() => {
    const fetchAbreviaturaParque = async () => {
      try {
        const abreviatura = await obtenerAbreviaturaParque(uuid_parque);
        setAbreviaturaParque(abreviatura);
        console.log('Abreviatura del parque:', abreviatura);
      } catch (error) {
        console.error('Error al obtener la abreviatura del parque:', error);
      }
    };

    if (uuid_parque) {
      fetchAbreviaturaParque();
    }
  }, [uuid_parque]);

  useEffect(() => {
    const fetchNumeroAerogenerador = async () => {
      try {
        const numero = await obtenerNumeroAerogenerador(uuid_aerogenerador);
        if (numero) {
          setNumeroAerogenerador(numero);
          console.log('Número del aerogenerador obtenido:', numero);
        } else {
          console.error('El número del aerogenerador es nulo o indefinido');
        }
      } catch (error) {
        console.error('Error al obtener el número del aerogenerador:', error);
      }
    };

    if (uuid_aerogenerador) {
      fetchNumeroAerogenerador();
    }
  }, [uuid_aerogenerador]);

  const handleCategoriaSelected = (categoria: number) => {
    setCategoriaDaño(categoria); // Actualiza la categoría
  };


  useEffect(() => {
    if (categoriaDaño !== 0) {
      generarCodigoAnomalia();
    }
  }, [categoriaDaño]);



  const generarCodigoAnomalia = () => {
    const fechaActual = new Date();
    const codigo = `${abreviaturaParque}-${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '')}-${numeroAerogenerador}-${siguienteNumeroDano}-${categoriaDaño}`;
    setCodigoAnomalia(codigo);
    console.log('Código de anomalía generado:', codigo);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    generarCodigoAnomalia(); // Genera el código antes de enviar el formulario

    try {
      const response = await crearAnomalia({
        uuid_aerogenerador: uuid_aerogenerador,
        uuid_componente: uuid_componente,
        uuid_inspeccion: uuid_inspeccion,
        uuid_tecnico: userId, // Puedes ajustar esto según tu lógica
        codigo_anomalia: codigoAnomalia,
        severidad_anomalia: categoriaDaño, // Ajusta esto según tu lógica
        dimension_anomalia: dimensionAnomalia, // Se recoge desde el formulario
        orientacion_anomalia: orientacionAnomalia, // Se recoge desde el formulario
        descripcion_anomalia: descripcionAnomalia, // Se recoge desde el formulario
        observacion_anomalia: observacionAnomalia, // Se recoge desde el formulario
        coordenada_x: 0, // Ajusta esto según tu lógica
        coordenada_y: 0, // Ajusta esto según tu lógica
      });

      console.log('Anomalía creada:', response);
    } catch (error) {
      console.error('Error al crear la anomalía:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-2 space-y-4">
      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Seleccionar Severidad</h2>
      <ul className="text-korsar-text-2">
        <li>1- Sin daño</li>
        <li>2- Daño menor</li>
        <li>3- Daño significativo</li>
        <li>4- Daño mayor</li>
        <li>5- Daño crítico</li>
      </ul>

      <div className="flex w-full flex-row space-x-20">
        <SelectorCategoria onCategoriaSelected={handleCategoriaSelected} /> {/* Pasar la función para actualizar la categoría */}
        {/* Mostrar código de anomalía */}
        <div className="flex flex-col">
          <h2 className="text-lg text-korsar-text-1 mb-1">Código de Anomalía</h2>
            <p className="text-korsar-turquesa-viento underline">{codigoAnomalia}</p>
        </div>

      </div>


      <hr className="my-4 border-gray-300" />


      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Orientación de la Anomalía</h2>
      <p className="text-korsar-text-1">Ingrese la ubicación u orientación del daño en el componente</p>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Orientación</h2>
        <TextInput
          id="orientacion-anomalia"
          placeholder=""
          onChange={(e) => setOrientacionAnomalia(e.target.value)} // Manejo de cambios
          required
        />
      </div>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Descripción de la Anomalía</h2>
      <p className="text-korsar-text-1">Proporcione detalles específicos sobre el daño observado</p>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Dimensión</h2>
        <TextInput
          id="dimension-anomalia"
          placeholder=""
          value={dimensionAnomalia}
          onChange={(e) => setDimensionAnomalia(e.target.value)} // Manejo de cambios
          required
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Descripción</h2>
        <Textarea
          id="descripcion-anomalia"
          placeholder=""
          value={descripcionAnomalia}
          onChange={(e) => setDescripcionAnomalia(e.target.value)} // Manejo de cambios
          required
          rows={3}
          className="w-full h-full resize-none"
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Observaciones</h2>
        <Textarea
          id="observacion-anomalia"
          placeholder=""
          value={observacionAnomalia}
          onChange={(e) => setObservacionAnomalia(e.target.value)} // Manejo de cambios
          required
          rows={3}
          className="w-full h-full resize-none"
        />
      </div>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Asociación de Imágenes</h2>
      <p className="text-korsar-text-1">Haz click en las imagenes asociadas a esta anomalía</p>

      {/* DropZone */}
      <DropZone droppedImages={droppedImages} onRemoveImage={onRemoveImage} />

      <Button type="submit" >Crear Anomalía</Button>
    </form>
  );
}

export default FormularioAnomalias;
