import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextInput, Textarea, Button } from "flowbite-react";
import { DropZone } from "../inspecciones/dropZone";
import SelectorCategoria  from "../inspecciones/selectorCategoria";
import { obtenerSiguienteNumeroDano, crearAnomalia } from '../../services/anomalias';
import { obtenerAbreviaturaParque } from '../../services/parquesEolicos';
import { obtenerNumeroAerogenerador } from '../../services/aerogeneradores';
import { validarFormularioAnomalia } from '../../utils/validacionesAnomalia';
import { Anomalia, ValidacionErrores } from "../../utils/interfaces";
import { ConfirmacionModal } from '../inspecciones/modalConfirmacion';
import { crearImagenAnomalia } from '../../services/imagenesAnomalia';
import { ImagenAnomaliaFront } from '../../utils/interfaces';
import { ErrorAlert } from '../inspecciones/alertForm';
import { obtenerEstadoFinalAerogenerador } from '../../services/aerogeneradores';
import { cambiarEstadoFinalAerogenerador } from '../../services/aerogeneradores';
import { obtenerTipoComponente } from '../../services/componentesAerogeneradores';
import {ModalError} from "../inspecciones/modalErrorConfirmacion";
import {ConfirmacionModalRecepcion} from "../inspecciones/modalConfirmacionRecepcion";
import { Label, Select } from "flowbite-react";
import { patchAnomalia } from '../../services/anomalias';


interface FormularioAnomaliasProps {
  droppedImages: ImagenAnomaliaFront[];
  onRemoveImage: (imageId: string) => void;
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
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

  const [opcionHelice, setOpcionHelice] = useState<boolean>(false);
  const [errores, setErrores] = useState<ValidacionErrores>({});
  const [openModal, setOpenModal] = useState(false);  // Controla el estado del modal
  const [openModalConfirmacionCreacion, setOpenModalConfirmacionCreacion] = useState(false);  // Controla el estado del modal de confirmación
  const [openModalErrorCreacion, setOpenModalErrorCreacion] = useState(false);  // Controla el estado del modal de error
  const [errorMessageCreacion, setErrorMessage] = useState<string>('');  // Mensaje de error en la creación

  {/*CAMPOS FORMULARIO*/}
  const [orientacionAnomalia, setOrientacionAnomalia] = useState<string>(informacionIncialAnomalia?.orientacion_anomalia || '');
  const [codigoAnomalia, setCodigoAnomalia] = useState<string>(informacionIncialAnomalia?.codigo_anomalia || '');
  const [categoriaDaño, setCategoriaDaño] = useState<number>(informacionIncialAnomalia?.severidad_anomalia || 0);
  const [tipoComponente, setTipoComponente] = useState<string>(informacionIncialAnomalia?.ubicacion_anomalia || '');
  const [ubicacionAnomalia, setUbicacionAnomalia] = useState<string>(informacionIncialAnomalia?.ubicacion_anomalia || '');
  const [dimensionAnomalia, setDimensionAnomalia] = useState<string>(informacionIncialAnomalia?.dimension_anomalia || '');
  const [descripcionAnomalia, setDescripcionAnomalia] = useState<string>(informacionIncialAnomalia?.descripcion_anomalia || '');
  const [userId, setUserId] = useState<string | null>(null);
  const dataEdit: Partial<Anomalia> = {};



  const [errorVisibility, setErrorVisibility] = useState({
    severidadAnomalia: true,
    orientacionAnomalia: true,
    dimensionAnomalia: true,
    descripcionAnomalia: true,
    imagenesAnomalia: true,
    ubicacionAnomalia: true,
  });

  const UBICACION_COMPONENTE_CHOICES = [
    { value: 'aspa_interna', label: 'Aspa Interna' },
    { value: 'aspa_externa', label: 'Aspa Externa' },
    { value: 'nacelle', label: 'Nacelle/Hub' },
    { value: 'torre', label: 'Torre' },
  ];


  /** ----------------------------------- Efectos -----------------------------------**/


  /**
   * Genera el código de la anomalía cuando se selecciona una categoría
   */
  useEffect(() => {
    if (categoriaDaño !== 0 && !modoEditar) {
      generarCodigoAnomalia();
    }
  }, [categoriaDaño,siguienteNumeroDano]);


  /**
   * Obtiene el ID del usuario almacenado en el almacenamiento local
   */
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (modoEditar && informacionIncialAnomalia) {
    editarCodigoAnomalia();
    }
  } , [categoriaDaño]);



  /**
   * Obtener el tipo de componente cuando se selecciona uno
   */

  useEffect(() => {
    const fetchTipoComponente = async () => {
      try {
        const tipoComponenteValue = await obtenerTipoComponente(uuid_componente);
        setTipoComponente(tipoComponenteValue);
        console.log("Tipo_componente:", tipoComponenteValue);

        // Buscar el objeto con el tipoComponente y obtener el label correspondiente
        const componenteSeleccionado = UBICACION_COMPONENTE_CHOICES.find(
          (element) => element.label === tipoComponenteValue
        );

        console.log("Componente seleccionado:", componenteSeleccionado);

        if (componenteSeleccionado) {
          if (componenteSeleccionado.value === "nacelle" || componenteSeleccionado.value === "torre") {
            setOpcionHelice(false);
            setUbicacionAnomalia(componenteSeleccionado.value); // Asignar el valor para Torre o Nacelle
            console.log("Ubicación de la anomalía:", ubicacionAnomalia);
          } else if (componenteSeleccionado.value === "aspa_interna" || componenteSeleccionado.value === "aspa_externa") {
            setOpcionHelice(true); // Permitir seleccionar Aspa Interna/Externa
            setUbicacionAnomalia(""); // Limpiar ubicación para permitir selección
          }
        } else {
          console.error("Componente no encontrado en las opciones");
          setUbicacionAnomalia(""); // Valor predeterminado en caso de no encontrar el componente
        }
      } catch (error) {
        console.error("Error al obtener el componente:", error);
      }
    };

    // Solo ejecuta fetchTipoComponente si uuid_componente tiene valor
    if (uuid_componente) {
      fetchTipoComponente();
    }
  }, []); // Vacío para que solo se ejecute al montar el componente



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
  }, [uuid_componente, uuid_aerogenerador, categoriaDaño, modoEditar]);


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
  }, [uuid_componente, uuid_aerogenerador, categoriaDaño]);

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


  /**----------------------------- Maneja Cambios en variables ------------------------------*/

  /**
   * Maneja cambios en la categoría seleccionada
   * @param categoria
   */
  const handleCategoriaSelected = (categoria: number) => {
    setCategoriaDaño(categoria);
  };

  /**
   * Maneja cambios en alertas de errores
   * @param errorKey
   */
  const handleCloseErrorAlert = (errorKey: keyof ValidacionErrores) => {
    setErrorVisibility((prev) => ({ ...prev, [errorKey]: false }));
  };



  /**----------------------------- Generar Codigo de Anomalia ------------------------------*/

  /**
   * Genera el código de la anomalía
   */
  const generarCodigoAnomalia = () => {
    const fechaActual = new Date();
    const codigo = `${abreviaturaParque}-${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '')}-${numeroAerogenerador}-${siguienteNumeroDano}-${categoriaDaño}`;
    setCodigoAnomalia(codigo);
  };

  const editarCodigoAnomalia = () => {
    if (modoEditar && informacionIncialAnomalia) {
      // Dividir el código de anomalía existente en sus partes
      const partesCodigo = informacionIncialAnomalia.codigo_anomalia.split("-");

      // Reemplazar la última parte con el valor actual de `categoriaDaño` (nueva severidad)
      partesCodigo[partesCodigo.length - 1] = categoriaDaño.toString();

      // Unir las partes para crear el nuevo código de anomalía
      const codigoActualizado = partesCodigo.join("-");
      setCodigoAnomalia(codigoActualizado);
    }
  };


  /** -------------------Validacion de Formulario----------------------------------**/


  /**
   * Valida los campos del formulario y abre modal de confirmación
   * @param event
   * @returns
   */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();


    if (modoEditar && informacionIncialAnomalia) {

       // Comparar cada campo con su valor inicial y, si ha cambiado, agrégalo a `data`
       const validarInformacion: Partial<Anomalia> = {};

      // Comparar y agregar campos modificados a `dataEdit` y `validarInformacion`
      if (categoriaDaño !== informacionIncialAnomalia.severidad_anomalia) {
          dataEdit.severidad_anomalia = categoriaDaño;
          validarInformacion.severidad_anomalia = categoriaDaño;
      }

      if (dimensionAnomalia !== informacionIncialAnomalia.dimension_anomalia) {
          dataEdit.dimension_anomalia = dimensionAnomalia;
          validarInformacion.dimension_anomalia = dimensionAnomalia;
      }

      if (orientacionAnomalia !== informacionIncialAnomalia.orientacion_anomalia) {
          dataEdit.orientacion_anomalia = orientacionAnomalia;
          validarInformacion.orientacion_anomalia = orientacionAnomalia;
      }

      if (ubicacionAnomalia !== informacionIncialAnomalia.ubicacion_anomalia) {
          dataEdit.ubicacion_anomalia = ubicacionAnomalia;
          validarInformacion.ubicacion_anomalia = ubicacionAnomalia;
      }

      if (descripcionAnomalia !== informacionIncialAnomalia.descripcion_anomalia) {
          dataEdit.descripcion_anomalia = descripcionAnomalia;
          validarInformacion.descripcion_anomalia = descripcionAnomalia;
      }

      if (userId !== informacionIncialAnomalia.uuid_tecnico) {
          dataEdit.uuid_tecnico = userId;
          validarInformacion.uuid_tecnico = userId;
      }


      const validacionErrores = validarFormularioAnomalia(
        validarInformacion.severidad_anomalia ?? undefined,
        validarInformacion.dimension_anomalia ?? undefined,
        validarInformacion.orientacion_anomalia ?? undefined,
        validarInformacion.descripcion_anomalia ?? undefined,
        validarInformacion.ubicacion_anomalia ?? undefined,
        droppedImages
    );


        console.log('Datos que se enviarán:', dataEdit);

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
    }
    else {
        console.log('Datos que se enviarán:', {
          uuid_aerogenerador,
          uuid_componente_aerogenerador: uuid_componente, // Asegúrate de usar el nombre correcto
          uuid_inspeccion,
          uuid_tecnico: userId,
          codigo_anomalia: codigoAnomalia,
          severidad_anomalia: categoriaDaño,
          dimension_anomalia: dimensionAnomalia,
          orientacion_anomalia: orientacionAnomalia,
          ubicacion_componente: ubicacionAnomalia,
          descripcion_anomalia: descripcionAnomalia,
        });


        console.log('validando entradas');
        const validacionErrores = validarFormularioAnomalia(
          categoriaDaño,
          dimensionAnomalia,
          orientacionAnomalia,
          descripcionAnomalia,
          ubicacionAnomalia,
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
    }}

    console.log('enviando formulario');

    // Abrir el modal si la validación es exitosa
    setOpenModal(true);
  };

  /** -------------------Logica de Post----------------------------------**/

  /**
   * Restablece los campos del formulario después de enviar los datos
   */

  const resetForm = () => {
    // Restablece los estados de los campos de entrada y el selector de categoría
    setCategoriaDaño(0);
    setOrientacionAnomalia('');
    setDimensionAnomalia('');
    setDescripcionAnomalia('');
    setTipoComponente('');
    setUbicacionAnomalia('');
    setOpcionHelice(false);
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
   * Envía los datos del formulario al servidor
   */
  const confirmarEnvio = async () => {
    console.log('confirmar envío');
    try {

      if (modoEditar && informacionIncialAnomalia ) {
        console.log('Modo editar');



      if (Object.keys(dataEdit).length > 0) {
        // Llama a tu función para hacer PATCH (debes implementarla en `services/anomalias`)
        await patchAnomalia(informacionIncialAnomalia.uuid_anomalia, dataEdit);
        console.log("Anomalía actualizada con éxito");
      } else {
            console.log("No hay cambios para actualizar.");
      }

      actualizarAnomaliasDisplay();  // Actualiza la visualización después de la edición
      setOpenModalConfirmacionCreacion(true);  // Abre el modal de confirmación


    } else {

        console.log('Antes de llamar a crearAnomalia');
        const response = await crearAnomalia({
          uuid_aerogenerador: uuid_aerogenerador,
          uuid_componente: uuid_componente,
          uuid_inspeccion: uuid_inspeccion,
          uuid_tecnico: userId,
          codigo_anomalia: codigoAnomalia,
          severidad_anomalia: categoriaDaño,
          ubicacion_componente: ubicacionAnomalia,
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
        if (response_estado_final !== null && response_estado_final < categoriaDaño) {
          await cambiarEstadoFinalAerogenerador(uuid_aerogenerador, uuid_inspeccion, categoriaDaño);
          actualizarEstadoFinalAero(!cambioEstadoFinalAero);
        }


        console.log('Después de llamar a obtenerEstadoFinalAerogenerador');

        actualizarAnomaliasDisplay(); // Actualizar las anomalías en el panel
        setOpenModal(false);  // Cierra el modal después de confirmar el envío
        setOpenModalConfirmacionCreacion(true);  // Abre el modal de confirmación de creación
        resetForm();  // Restablece el formulario después de enviar los datos

      }


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

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Seleccionar Severidad</h2>
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
      <div className="flex w-full flex-row space-x-20">
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


{/* Orientación de la Anomalía */}
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


{/* SELECTOR ASPA INTERNA O EXTERNA */}
      {opcionHelice && (
        <>
          <hr className="my-4 border-gray-300" />

          <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Ubicación de la Anomalía</h2>

          <div className="mb-2 block">
            <Label htmlFor="ubicacionAspa" value="Asocie anomalía a Aspa interna o externa" />
            <Select
              id="ubicacionAspa"
              required
              value={informacionIncialAnomalia?.ubicacion_anomalia} // Controlar el valor del Select con el estado
              onChange={(e) => setUbicacionAnomalia(e.target.value)} // Actualizar el valor en el estado
            >
              <option value="">Seleccione una opción</option>
              <option value="aspa_interna">Aspa Interna</option>
              <option value="aspa_externa">Aspa Externa</option>
            </Select>
          </div>
        </>
      )}


      {opcionHelice &&  errores.ubicacionAnomalia && errorVisibility.ubicacionAnomalia && (
        <ErrorAlert message={errores.ubicacionAnomalia} onClose={() => handleCloseErrorAlert('ubicacionAnomalia')} />
      )}

      <hr className="my-4 border-gray-300" />


{/* ZONA DE IMAGENES */}
      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Asociación de Imágenes</h2>
      <p className="text-korsar-text-1">Haz click en las imágenes asociadas a esta anomalía</p>
      {errores.imagenesAnomalia && errorVisibility.imagenesAnomalia && (
        <ErrorAlert message={errores.imagenesAnomalia} onClose={() => handleCloseErrorAlert('imagenesAnomalia')} />
      )}

      <DropZone droppedImages={droppedImages} onRemoveImage={onRemoveImage} />

      <Button type="submit">Crear Anomalía</Button>

{/* ZONA MODALES*/}
      {/* Modal de confirmación de envío */}
      <ConfirmacionModal
        openModal={openModal}
        onConfirm={confirmarEnvio}
        onClose={() => setOpenModal(false)}
      />

      {/* Modal de confirmación de creación exitosa */}
      <ConfirmacionModalRecepcion
        openModal={openModalConfirmacionCreacion}
        onConfirm={() => setOpenModalConfirmacionCreacion(false)}
        onClose={() => setOpenModalConfirmacionCreacion(false)}
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
