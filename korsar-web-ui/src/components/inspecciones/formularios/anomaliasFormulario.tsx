import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextInput, Textarea, Button } from "flowbite-react";
import { DropZone } from "../zonasDragDrop/dropZone";
import SelectorCategoria  from "../selectorCategoria";
import { obtenerSiguienteNumeroDano, crearAnomalia } from '../../../services/anomalias';
import { obtenerAbreviaturaParque } from '../../../services/parquesEolicos';
import { obtenerNumeroAerogenerador } from '../../../services/aerogeneradores';
import { validarFormularioAnomalia } from '../../../utils/validacionesAnomalia';
import { Anomalia, ValidacionErrores } from "../../../utils/interfaces";
import { obtenerTipoComponente } from '../../../services/componentesAerogeneradores';
import { ConfirmacionModal } from '../modales/modalConfirmacion';
import { crearImagenAnomalia } from '../../../services/imagenesAnomalia';
import { ImagenAnomaliaFront } from '../../../utils/interfaces';
import { ErrorAlert } from '../alertForm';
import { obtenerEstadoFinalAerogenerador } from '../../../services/aerogeneradores';
import { cambiarEstadoFinalAerogenerador } from '../../../services/aerogeneradores';
import {ModalError} from "../modales/modalErrorConfirmacion";
import {ConfirmacionModalRecepcion} from "../modales/modalConfirmacionRecepcion";


interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

interface FormularioAnomaliasProps {
  droppedImages: ImagenAnomaliaFront[];
  onRemoveImage: (imageId: Imagen) => void;
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  imagenesParaEliminar: string[];
  uuid_parque: string;
  actualizarEstadoFinalAero: (cambioEstadoFinalAero: boolean) => void;
  actualizarAnomaliasDisplay: () => void; // Actualiza la visualización de las anomalías
  cambioEstadoFinalAero: boolean;
  resetDroppedImages: () => void;
  modoEditar?: boolean;
  informacionIncialAnomalia?: Anomalia;
}

export function FormularioAnomalias({ droppedImages, onRemoveImage, uuid_aerogenerador, uuid_componente, uuid_inspeccion, uuid_parque, resetDroppedImages, actualizarEstadoFinalAero, actualizarAnomaliasDisplay, cambioEstadoFinalAero,  modoEditar = false, informacionIncialAnomalia }: FormularioAnomaliasProps) {
    const [siguienteNumeroDano, setSiguienteNumeroDano] = useState<string>('');
    const [abreviaturaParque, setAbreviaturaParque] = useState<string>('');
    const [numeroAerogenerador, setNumeroAerogenerador] = useState<number>(0);

    const [errores, setErrores] = useState<ValidacionErrores>({});
    const [openModal, setOpenModal] = useState(false);  // Controla el estado del modal
    const [openModalConfirmacionCreacion, setOpenModalConfirmacionCreacion] = useState(false);  // Controla el estado del modal de confirmación
    const [openModalErrorCreacion, setOpenModalErrorCreacion] = useState(false);  // Controla el estado del modal de error
    const [errorMessageCreacion, setErrorMessage] = useState<string>('');  // Mensaje de error en la creación
    const [userId, setUserId] = useState<string | null>(null);



    {/*CAMPOS FORMULARIO*/}
    const [orientacionAnomalia, setOrientacionAnomalia] = useState<string>('');
    const [codigoAnomalia, setCodigoAnomalia] = useState<string>('');
    const [categoriaDaño, setCategoriaDaño] = useState<number>(0);
    const [dimensionAnomalia, setDimensionAnomalia] = useState<string>('');
    const [descripcionAnomalia, setDescripcionAnomalia] = useState<string>('');
    const [tipoComponente, setTipoComponente] = useState<string>('');

    {/*VISIBILIDAD DE ERRORES*/}
    const [errorVisibility, setErrorVisibility] = useState({
      severidadAnomalia: true,
      orientacionAnomalia: true,
      dimensionAnomalia: true,
      descripcionAnomalia: true,
      imagenesAnomalia: true,
      ubicacionAnomalia: true,
    });


/** ----------------------------------------------------------------------------------**/


    /**
     * Genera el código de la anomalía cuando se selecciona una categoría
     */
    useEffect(() => {
      if (categoriaDaño !== 0 && !modoEditar) {
        generarCodigoAnomalia();
      }
    }, [categoriaDaño,siguienteNumeroDano]);


/** ----------------------------------------------------------------------------------**/


    /**
     * Obtiene el ID del usuario almacenado en el almacenamiento local
     */
    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }, []);


/** ----------------------------------------------------------------------------------**/



    /**
     * Mapear el tipo de componente del backend a las abreviaturas específicas.
     * @param tipo - Tipo de componente recibido del backend.
     * @returns Abreviatura correspondiente al tipo de componente.
     */
    const mapearTipoComponente = (tipo: string): string => {
      const mapaTipos: Record<string, string> = {
        'helice_a': 'BL',
        'helice_b': 'BL',
        'helice_c': 'BL',
        'torre': 'TO',
        'nacelle': 'HU/NA',
      };

      return mapaTipos[tipo] || 'Tipo no reconocido';
    };



/** ----------------------------------------------------------------------------------**/

    useEffect(() => {
      console.log('Componente:', uuid_componente);
      const fetchTipoComponente = async () => {
        try {
          const tipo = await obtenerTipoComponente(uuid_componente);
          const abreviatura = mapearTipoComponente(tipo);
          console.log('Tipo de componente:', abreviatura);
          setTipoComponente(abreviatura); // Establece la abreviatura como tipo de componente
        } catch (error) {
          console.error('Error al obtener el tipo de componente:', error);
        }
      };

      if (uuid_componente) {
        fetchTipoComponente();
      }
    }, [uuid_componente]);

/** ----------------------------------------------------------------------------------**/


  /**
   * Obtiene el siguiente número de daño cuando se selecciona un componente
   */
  useEffect(() => {
    if (!modoEditar && uuid_componente) {
      const fetchSiguienteNumeroDano = async () => {
        try {
          const numero = await obtenerSiguienteNumeroDano(uuid_componente);
          console.log('Siguiente número de daño:', numero);
          setSiguienteNumeroDano(numero);
        } catch (error) {
          console.error('Error al obtener el siguiente número de daño:', error);
        }
      };

      fetchSiguienteNumeroDano();
    }
  }, [uuid_componente, uuid_aerogenerador, categoriaDaño]);


/** ----------------------------------------------------------------------------------**/


  /**
   * Obtiene la abreviatura del parque eólico cuando se selecciona un parque
   */
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
  }, [uuid_componente, uuid_aerogenerador]);


/** ----------------------------------------------------------------------------------**/

    /**
     * Obtiene el número del aerogenerador cuando se selecciona uno
     */
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


/** ----------------------------------------------------------------------------------**/


    /**
     * Maneja cambios en la categoría seleccionada
     * @param categoria
     */
    const handleCategoriaSelected = (categoria: number) => {
      setCategoriaDaño(categoria);
      generarCodigoAnomalia();

    };

/** ----------------------------------------------------------------------------------**/

  /**
   * Maneja cambios en alertas de errores
   * @param errorKey
   */
  const handleCloseErrorAlert = (errorKey: keyof ValidacionErrores) => {
    setErrorVisibility((prev) => ({ ...prev, [errorKey]: false }));
  };



/** ----------------------------------------------------------------------------------**/
  /**
   * Genera el código de la anomalía
   */
  const generarCodigoAnomalia = () => {
      const fechaActual = new Date();
      const codigo = `${abreviaturaParque}-${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '')}-${numeroAerogenerador}-${tipoComponente}-${siguienteNumeroDano}-${categoriaDaño}`;
      setCodigoAnomalia(codigo);
  };





  /** ----------------------------------------------------------------------------------**/


  /**
   * Valida los campos del formulario y abre modal de confirmación
   * @param event
   * @returns
   */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

        console.log('Datos que se enviarán:', {
          uuid_aerogenerador,
          uuid_componente_aerogenerador: uuid_componente, // Asegúrate de usar el nombre correcto
          uuid_inspeccion,
          uuid_tecnico: userId,
          codigo_anomalia: codigoAnomalia,
          severidad_anomalia: categoriaDaño,
          dimension_anomalia: dimensionAnomalia,
          orientacion_anomalia: orientacionAnomalia,
          descripcion_anomalia: descripcionAnomalia,
        });


        console.log('validando entradas');
        const validacionErrores = validarFormularioAnomalia(
          categoriaDaño,
          dimensionAnomalia,
          orientacionAnomalia,
          descripcionAnomalia,
          droppedImages
        );

        if (Object.keys(validacionErrores).length > 0) {
          setErrores(validacionErrores);
          setErrorVisibility({
            severidadAnomalia: true,
            orientacionAnomalia: true,
            dimensionAnomalia: true,
            descripcionAnomalia: true,
            imagenesAnomalia: true,
            ubicacionAnomalia: true,
          });
          return;
    }

    console.log('enviando formulario');

    // Abrir el modal si la validación es exitosa
    setOpenModal(true);
  };

/** ----------------------------------------------------------------------------------**/


      /**
       * Restablece los campos del formulario después de enviar los datos
       */

      const resetForm = () => {
        // Restablece los estados de los campos de entrada y el selector de categoría
        setCategoriaDaño(0);
        setOrientacionAnomalia('');
        setDimensionAnomalia('');
        setDescripcionAnomalia('');
        setCodigoAnomalia(''); // Restablece el código de anomalía
        setErrores({});
        resetDroppedImages(); // Limpia las imágenes soltadas
        setErrorVisibility({
          severidadAnomalia: false,
          orientacionAnomalia: false,
          dimensionAnomalia: false,
          descripcionAnomalia: false,
          imagenesAnomalia: false,
          ubicacionAnomalia: false,
        });
      };

      /**
       * Resetea formulario cada vez que cambia componente, aerogenerador o inspección
       */
      useEffect(() => {
        resetForm();
      },[uuid_componente,uuid_aerogenerador,uuid_inspeccion]);



/** ----------------------------------------------------------------------------------**/


  /**
   * Envía los datos del formulario al servidor
   */
  const confirmarEnvio = async () => {
    console.log('confirmar envío');
    try {

        console.log('Antes de llamar a crearAnomalia');
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
        });

        console.log('Después de llamar a crearAnomalia');

        console.log("Anomalía creada:", response);

        //

        /*------------Subir las imágenes asociadas a la anomalía------------*/
        for (const imagen of droppedImages) {
          console.log('Subiendo imagen:', imagen);
          await crearImagenAnomalia({
            uuid_imagen: imagen.uuid_imagen,
            uuid_anomalia: response.uuid_anomalia,
          });
        }

        /** ----------cambiar estado final del aerogenerador si corresponde------- **/
        console.log('Antes de llamar a obtenerEstadoFinalAerogenerador');
        const response_estado_final = await obtenerEstadoFinalAerogenerador(uuid_aerogenerador, uuid_inspeccion);
        console.log('Estado final:', response_estado_final);
        if (response_estado_final === null || response_estado_final < categoriaDaño) {
          await cambiarEstadoFinalAerogenerador(uuid_aerogenerador, uuid_inspeccion, categoriaDaño);
          actualizarEstadoFinalAero(!cambioEstadoFinalAero);
        }


        console.log('Después de llamar a obtenerEstadoFinalAerogenerador');

        actualizarAnomaliasDisplay(); // Actualizar las anomalías en el panel
        setOpenModal(false);  // Cierra el modal después de confirmar el envío
        setOpenModalConfirmacionCreacion(true);  // Abre el modal de confirmación de creación
        resetForm();  // Restablece el formulario después de enviar los datos




    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        if (error.response) {
          message = `Error en la respuesta del servidor: ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          message = 'No se recibió respuesta del servidor.';
        } else {
          message = `Error al configurar la solicitud: ${error.message}`;
        }
      } else {
        message = 'Ocurrió un error desconocido.';
      }
      setErrorMessage(message);
      setOpenModalErrorCreacion(true);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-2 space-y-4">


          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-2">Seleccionar Severidad</h2>
          {errores.severidadAnomalia && errorVisibility.severidadAnomalia && (
          <ErrorAlert message={errores.severidadAnomalia} onClose={() => handleCloseErrorAlert('severidadAnomalia')} />)}
            <ul className="text-korsar-text-2">
            <li>1- Sin daño</li>
            <li>2- Daño menor</li>
            <li>3- Daño significativo</li>
            <li>4- Daño mayor</li>
            <li>5- Daño crítico</li>
          </ul>

    {/* Selector de categoria asociada a la Anomalía */}
    <div className="flex w-full flex-col items-start gap-6 mt-6 mb-6">
            <SelectorCategoria onCategoriaSelected={handleCategoriaSelected} selectedCategoria={categoriaDaño} />
            <div className="flex flex-col">
              <h2 className="text-lg text-korsar-text-1 mb-1">Código de Anomalía</h2>
              <p className="text-korsar-turquesa-viento underline">{codigoAnomalia}</p>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />


    {/* Orientación de la Anomalía */}
          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Orientación de la Anomalía</h2>
          <p className="text-korsar-text-1">Ingrese la ubicación u orientación del daño en el componente</p>
          {errores.orientacionAnomalia && errorVisibility.orientacionAnomalia && (
            <ErrorAlert message={errores.orientacionAnomalia} onClose={() => handleCloseErrorAlert('orientacionAnomalia')} />
          )}
          <TextInput
            id="orientacion-anomalia"
            placeholder="Ingrese orientación"
            value = {orientacionAnomalia}
            onChange={(e) => setOrientacionAnomalia(e.target.value)}
          />

          <hr className="my-4 border-gray-300" />


    {/* Dimension de la Anomalía */}
          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Dimensiones de la Anomalía</h2>
          <p className="text-korsar-text-1">Ingrese la dimensiones del daño en el componente</p>
          {errores.dimensionAnomalia && errorVisibility.dimensionAnomalia && (
            <ErrorAlert message={errores.dimensionAnomalia} onClose={() => handleCloseErrorAlert('dimensionAnomalia')} />
          )}

          <TextInput
            id="dimension-anomalia"
            placeholder="Ingrese dimension"
            value = {dimensionAnomalia}
            onChange={(e) => setDimensionAnomalia(e.target.value)}
          />

          <hr className="my-4 border-gray-300" />

    {/* DESCRIPCION DE LA ANOMALÍA*/}
          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Descripción de la Anomalía</h2>
          <p className="text-korsar-text-1">Proporcione detalles específicos sobre el daño observado</p>
          {errores.descripcionAnomalia && errorVisibility.descripcionAnomalia && (
            <ErrorAlert message={errores.descripcionAnomalia} onClose={() => handleCloseErrorAlert('descripcionAnomalia')} />
          )}

          <Textarea
            id="descripcion-anomalia"
            placeholder="Ingrese descripción"
            value={descripcionAnomalia}
            onChange={(e) => setDescripcionAnomalia(e.target.value)}
            rows={3}
            className="w-full h-full resize-none"
          />


          <hr className="my-4 border-gray-300" />


    {/* ZONA DE IMAGENES */}
          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Asociación de Imágenes</h2>
          <p className="text-korsar-text-1">Haz click en las imágenes asociadas a esta anomalía</p>
          {errores.imagenesAnomalia && errorVisibility.imagenesAnomalia && (
            <ErrorAlert message={errores.imagenesAnomalia} onClose={() => handleCloseErrorAlert('imagenesAnomalia')} />
          )}

          <DropZone droppedImages={droppedImages} onRemoveImage={onRemoveImage} />

    {/* BOTON CONFIRMACION */}
          <Button type="submit">Crear Anomalía</Button>

    {/* ZONA MODALES*/}
          {/* Modal de confirmación de envío */}
          <ConfirmacionModal
            openModal={openModal}
            onConfirm={confirmarEnvio}
            message='¿Estas seguro que quieres crear la Anomalia?'
            onClose={() => setOpenModal(false)}
          />


          {/* Modal de confirmación de creación exitosa */}
            <ConfirmacionModalRecepcion
              openModal={openModalConfirmacionCreacion}
              onConfirm={() => setOpenModalConfirmacionCreacion(false)}
              onClose={() => setOpenModalConfirmacionCreacion(false)}
              mensaje="¡Tu anomalía fue creada exitosamente!"
          />


          {/* Modal de error en la creación */}
          <ModalError
            openModal={openModalErrorCreacion}
            errorMessage={errorMessageCreacion}
            onConfirm={() => setOpenModalErrorCreacion(false)}
            onClose={() => setOpenModalErrorCreacion(false)}
          />

    </form>
  );
}

export default FormularioAnomalias;
