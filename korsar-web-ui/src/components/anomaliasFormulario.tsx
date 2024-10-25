import React, { useEffect, useState } from 'react';
import { TextInput, Textarea, Button } from "flowbite-react";
import SelectorCategoria from "./selectorCategoria";
import { DropZone } from "./dropZone";
import { obtenerSiguienteNumeroDano, crearAnomalia } from '../services/anomalias';
import { obtenerAbreviaturaParque } from '../services/parqueEolico';
import { obtenerNumeroAerogenerador } from '../services/aerogeneradores';
import { validarFormularioAnomalia } from '../utils/validacionesAnomalia';
import { ValidacionErrores } from "../utils/interfaces";
import { ConfirmacionModal } from './modalConfirmacion';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface FormularioAnomaliasProps {
  droppedImages: Imagen[];
  onRemoveImage: (imageId: string) => void;
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  uuid_parque: string;
}

export function FormularioAnomalias({ droppedImages, onRemoveImage, uuid_aerogenerador, uuid_componente, uuid_inspeccion, uuid_parque }: FormularioAnomaliasProps) {
  const [siguienteNumeroDano, setSiguienteNumeroDano] = useState<string>('');
  const [abreviaturaParque, setAbreviaturaParque] = useState<string>('');
  const [numeroAerogenerador, setNumeroAerogenerador] = useState<number>(0);
  const [codigoAnomalia, setCodigoAnomalia] = useState<string>('');
  const [categoriaDaño, setCategoriaDaño] = useState<number>(0);
  const [orientacionAnomalia, setOrientacionAnomalia] = useState<string>('');
  const [dimensionAnomalia, setDimensionAnomalia] = useState<string>('');
  const [descripcionAnomalia, setDescripcionAnomalia] = useState<string>('');
  const [observacionAnomalia, setObservacionAnomalia] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [errores, setErrores] = useState<ValidacionErrores>({});
  const [openModal, setOpenModal] = useState(false);  // Controla el estado del modal

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchSiguienteNumeroDano = async () => {
      try {
        const numero = await obtenerSiguienteNumeroDano(uuid_componente);
        setSiguienteNumeroDano(numero);
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
    setCategoriaDaño(categoria);
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
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log('validando entradas');
    const validacionErrores = validarFormularioAnomalia(
      categoriaDaño,
      dimensionAnomalia,
      orientacionAnomalia,
      descripcionAnomalia,
      observacionAnomalia
    );

    if (Object.keys(validacionErrores).length > 0) {
      setErrores(validacionErrores);
      return;
    }

    console.log('enviando formulario');

    // Abrir el modal si la validación es exitosa
    setOpenModal(true);
  };

  const confirmarEnvio = async () => {
    console.log('confirmar envío');
    try {
      const response = await crearAnomalia({
        uuid_aerogenerador: uuid_aerogenerador,
        uuid_componente: uuid_componente,
        uuid_inspeccion: uuid_inspeccion,
        uuid_tecnico: userId,
        codigo_anomalia: codigoAnomalia,
        severidad_anomalia: categoriaDaño,
        dimension_anomalia: dimensionAnomalia,
        orientacion_anomalia: orientacionAnomalia,
        descripcion_anomalia: descripcionAnomalia,
        observacion_anomalia: observacionAnomalia,
      });

      console.log("Anomalía creada:", response);
      setOpenModal(false);  // Cierra el modal después de confirmar el envío
    } catch (error) {
      console.error("Error al crear la anomalía:", error);
      setOpenModal(false);  // Cierra el modal en caso de error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-2 space-y-4">
      {/* Mostrar mensajes de error */}
      {errores.severidadAnomalia && <p className="text-red-500">{errores.severidadAnomalia}</p>}
      {errores.dimensionAnomalia && <p className="text-red-500">{errores.dimensionAnomalia}</p>}
      {errores.orientacionAnomalia && <p className="text-red-500">{errores.orientacionAnomalia}</p>}
      {errores.descripcionAnomalia && <p className="text-red-500">{errores.descripcionAnomalia}</p>}
      {errores.observacionAnomalia && <p className="text-red-500">{errores.observacionAnomalia}</p>}

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Seleccionar Severidad</h2>
      <ul className="text-korsar-text-2">
        <li>1- Sin daño</li>
        <li>2- Daño menor</li>
        <li>3- Daño significativo</li>
        <li>4- Daño mayor</li>
        <li>5- Daño crítico</li>
      </ul>

      <div className="flex w-full flex-row space-x-20">
        <SelectorCategoria onCategoriaSelected={handleCategoriaSelected} />
        <div className="flex flex-col">
          <h2 className="text-lg text-korsar-text-1 mb-1">Código de Anomalía</h2>
          <p className="text-korsar-turquesa-viento underline">{codigoAnomalia}</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Orientación de la Anomalía</h2>
      <p className="text-korsar-text-1">Ingrese la ubicación u orientación del daño en el componente</p>
      <TextInput
        id="orientacion-anomalia"
        placeholder="Ingrese orientación"
        onChange={(e) => setOrientacionAnomalia(e.target.value)}
        required
      />

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Dimensiones de la Anomalía</h2>
      <p className="text-korsar-text-1">Ingrese la dimensiones del daño en el componente</p>
      <TextInput
        id="orientacion-anomalia"
        placeholder="Ingrese dimension"
        onChange={(e) => setDimensionAnomalia(e.target.value)}
        required
      />

      <hr className="my-4 border-gray-300" />


      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Descripción de la Anomalía</h2>
      <p className="text-korsar-text-1">Proporcione detalles específicos sobre el daño observado</p>
      <Textarea
        id="descripcion-anomalia"
        placeholder="Ingrese descripción"
        value={descripcionAnomalia}
        onChange={(e) => setDescripcionAnomalia(e.target.value)}
        required
        rows={3}
        className="w-full h-full resize-none"
      />

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Observación de la Anomalía</h2>
      <p className="text-korsar-text-1">Proporcione observaciones específicos sobre el daño observado</p>
      <Textarea
        id="descripcion-anomalia"
        placeholder="Ingrese descripción"
        value={observacionAnomalia}
        onChange={(e) => setObservacionAnomalia(e.target.value)}
        required
        rows={3}
        className="w-full h-full resize-none"
      />

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Asociación de Imágenes</h2>
      <p className="text-korsar-text-1">Haz click en las imágenes asociadas a esta anomalía</p>
      <DropZone droppedImages={droppedImages} onRemoveImage={onRemoveImage} />

      <Button type="submit">Crear Anomalía</Button>

      {/* Modal de confirmación */}
      <ConfirmacionModal
        openModal={openModal}
        onConfirm={confirmarEnvio}  // Se llama cuando el usuario confirma
        onClose={() => setOpenModal(false)}  // Cierra el modal si el usuario cancela
      />
    </form>
  );
}

export default FormularioAnomalias;
