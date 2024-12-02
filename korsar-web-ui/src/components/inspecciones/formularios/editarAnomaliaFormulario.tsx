import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextInput, Textarea, Button } from "flowbite-react";
import { DropZone } from "../zonasDragDrop/dropZone";
import SelectorCategoria  from "../selectorCategoria";

import { validarFormularioAnomalia } from '../../../utils/validacionesAnomalia';
import { Anomalia, ValidacionErrores } from "../../../utils/interfaces";
import { ConfirmacionModal } from '../modales/modalConfirmacion';
import { crearImagenAnomalia } from '../../../services/imagenesAnomalia';
import { ErrorAlert } from '../alertForm';
import { obtenerEstadoFinalAerogenerador } from '../../../services/aerogeneradores';
import { cambiarEstadoFinalAerogenerador } from '../../../services/aerogeneradores';
import {ModalError} from "../modales/modalErrorConfirmacion";
import {ConfirmacionModalRecepcion} from "../modales/modalConfirmacionRecepcion";
import { patchAnomalia } from '../../../services/anomalias';
import { eliminarImagenesAnomalias } from '../../../services/imagenesAnomalia';


interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

interface FormularioEditarAnomaliasProps {
  droppedImages: Imagen[];
  onRemoveImage: (imageId: Imagen) => void;
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  imagenesParaEliminar: string[];
  actualizarEstadoFinalAero: (cambioEstadoFinalAero: boolean) => void;
  actualizarAnomaliasDisplay: () => void; // Actualiza la visualización de las anomalías
  cambioEstadoFinalAero: boolean;
  resetDroppedImages: () => void;
  modoEditar: boolean;
  informacionIncialAnomalia: Anomalia;
}

export function FormularioEditarAnomalias({ droppedImages, onRemoveImage, uuid_aerogenerador, uuid_inspeccion , actualizarEstadoFinalAero, actualizarAnomaliasDisplay, cambioEstadoFinalAero,  modoEditar = true, informacionIncialAnomalia, imagenesParaEliminar }: FormularioEditarAnomaliasProps) {


  const [errores, setErrores] = useState<ValidacionErrores>({});
  const [openModal, setOpenModal] = useState(false);  // Controla el estado del modal
  const [openModalConfirmacionCreacion, setOpenModalConfirmacionCreacion] = useState(false);  // Controla el estado del modal de confirmación
  const [openModalErrorCreacion, setOpenModalErrorCreacion] = useState(false);  // Controla el estado del modal de error
  const [errorMessageCreacion, setErrorMessage] = useState<string>('');  // Mensaje de error en la creación
  const [userId, setUserId] = useState<string | null>(null);
  const [dataEdit, setDataEdit] = useState<Partial<Anomalia>>({});



  {/*CAMPOS FORMULARIO*/}
  const [orientacionAnomalia, setOrientacionAnomalia] = useState<string>(informacionIncialAnomalia.orientacion_anomalia );
  const [codigoAnomalia, setCodigoAnomalia] = useState<string>(informacionIncialAnomalia.codigo_anomalia );
  const [categoriaDaño, setCategoriaDaño] = useState<number>(informacionIncialAnomalia.severidad_anomalia );
  const [dimensionAnomalia, setDimensionAnomalia] = useState<string>(informacionIncialAnomalia.dimension_anomalia );
  const [descripcionAnomalia, setDescripcionAnomalia] = useState<string>(informacionIncialAnomalia.descripcion_anomalia );



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
     * Obtiene el ID del usuario almacenado en el almacenamiento local
     */
    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }, []);


/** ----------------------------------------------------------------------------------**/

    useEffect(() => {
      editarCodigoAnomalia();

    } , [categoriaDaño]);


/** ----------------------------------------------------------------------------------**/

    useEffect(() => {
        setOrientacionAnomalia(informacionIncialAnomalia.orientacion_anomalia );
        setCodigoAnomalia(informacionIncialAnomalia.codigo_anomalia );
        setCategoriaDaño(informacionIncialAnomalia.severidad_anomalia );
        setDimensionAnomalia(informacionIncialAnomalia.dimension_anomalia );
        setDescripcionAnomalia(informacionIncialAnomalia.descripcion_anomalia );


    }, [informacionIncialAnomalia, modoEditar]);




/** ----------------------------------------------------------------------------------**/
    /**
     * Maneja cambios en la categoría seleccionada
     * @param categoria
     */
    const handleCategoriaSelected = (categoria: number) => {
      setCategoriaDaño(categoria);

        editarCodigoAnomalia();

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

  const editarCodigoAnomalia = () => {
      const partesCodigo = informacionIncialAnomalia.codigo_anomalia.split("-");
      partesCodigo[partesCodigo.length - 1] = categoriaDaño.toString();
      const codigoActualizado = partesCodigo.join("-");
      setCodigoAnomalia(codigoActualizado);
  };


/** ----------------------------------------------------------------------------------**/

  /**
   * Valida los campos del formulario y abre modal de confirmación
   * @param event
   * @returns
   */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Comparar cada campo con su valor inicial y, si ha cambiado, agrégalo a `data`
    const validarInformacion: Partial<Anomalia> = {};

    // Comparar y agregar campos modificados a `dataEdit` y `validarInformacion`
    if (categoriaDaño !== informacionIncialAnomalia.severidad_anomalia) {
      validarInformacion.severidad_anomalia = categoriaDaño;
    }

    if (codigoAnomalia !== informacionIncialAnomalia.codigo_anomalia) {
      validarInformacion.codigo_anomalia = codigoAnomalia;
    }

    if (dimensionAnomalia !== informacionIncialAnomalia.dimension_anomalia) {
      validarInformacion.dimension_anomalia = dimensionAnomalia;
    }

    if (orientacionAnomalia !== informacionIncialAnomalia.orientacion_anomalia) {
      validarInformacion.orientacion_anomalia = orientacionAnomalia;
    }

    if (descripcionAnomalia !== informacionIncialAnomalia.descripcion_anomalia) {
      console.log('Descripción de la anomalía cambió:', descripcionAnomalia);
      validarInformacion.descripcion_anomalia = descripcionAnomalia;
    }

    if (userId !== informacionIncialAnomalia.uuid_tecnico) {
      validarInformacion.uuid_tecnico = userId;
    }

    setDataEdit((prevData) => ({ ...prevData, ...validarInformacion }));

    // Validar los datos antes de enviar
    const validacionErrores = validarFormularioAnomalia(
      validarInformacion.severidad_anomalia,
      validarInformacion.dimension_anomalia,
      validarInformacion.orientacion_anomalia,
      validarInformacion.descripcion_anomalia,
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

    console.log('Datos que se enviarán:', { ...dataEdit, droppedImages });

    // Abrir el modal si la validación es exitosa
    setOpenModal(true);
  };



/** ----------------------------------------------------------------------------------**/

  /**
   * Envía los datos del formulario al servidor
   */
  const confirmarEnvio = async () => {
    console.log('confirmar envío');
    try {

      if (modoEditar && informacionIncialAnomalia ) {
        console.log('Modo editar');


        console.log('DataEdit:', dataEdit);
        if (Object.keys(dataEdit).length > 0) {
          // Llama a tu función para hacer PATCH (debes implementarla en `services/anomalias`)
          await patchAnomalia(informacionIncialAnomalia.uuid_anomalia, dataEdit);
          console.log("Anomalía actualizada con éxito");
        } else {
              console.log("No hay cambios para actualizar.");
        }

        // Eliminar imagenes de la anomalía
        try {
          if (imagenesParaEliminar.length > 0) {
            console.log('Eliminando imágenes:', imagenesParaEliminar);

            // Llamada al servicio para eliminar imágenes en lote
            await eliminarImagenesAnomalias(imagenesParaEliminar);

            console.log('Imágenes eliminadas correctamente');
          } else {
            console.log('No hay imágenes para eliminar');
          }
        } catch (error) {
          console.error('Error al eliminar las imágenes:', error);
        }


        // subir nuevas imagenes de anomalia
        /*------------Subir las imágenes asociadas a la anomalía------------*/
        for (const imagen of droppedImages) {
            if (!imagen.uuid_imagen_anomalia) { // Verifica si es una nueva imagen
              console.log('Subiendo nueva imagen:', imagen);
              await crearImagenAnomalia({
                uuid_imagen: imagen.uuid_imagen,
                uuid_anomalia: informacionIncialAnomalia.uuid_anomalia,
              });
            } else {
              console.log('Imagen existente, no se sube:', imagen);
            }
          }


        /** ----------cambiar estado final del aerogenerador si corresponde------- **/
        console.log('Antes de llamar a obtenerEstadoFinalAerogenerador');
        const response_estado_final = await obtenerEstadoFinalAerogenerador(uuid_aerogenerador, uuid_inspeccion);
        if (response_estado_final === null || response_estado_final < categoriaDaño) {
            await cambiarEstadoFinalAerogenerador(uuid_aerogenerador, uuid_inspeccion, categoriaDaño);
          actualizarEstadoFinalAero(!cambioEstadoFinalAero);
        }



        actualizarAnomaliasDisplay();  // Actualiza la visualización después de la edición
        setOpenModal(false);
        setOpenModalConfirmacionCreacion(true);  // Abre el modal de confirmación


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

          <Button type="submit">Editar Anomalía</Button>

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
                mensaje="¡Tu anomalía fue editada exitosamente!"
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

export default FormularioEditarAnomalias;
