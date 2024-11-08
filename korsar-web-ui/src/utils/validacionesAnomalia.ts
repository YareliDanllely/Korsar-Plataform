import { ValidacionErrores } from "../utils/interfaces";
import { ImagenAnomaliaFront } from "../utils/interfaces";

  export const validarFormularioAnomalia = (
    severidadAnomalia: number,
    dimensionAnomalia: string,
    orientacionAnomalia: string,
    descripcionAnomalia: string,
    ubicacionAnomalia: string,
    imagenes: ImagenAnomaliaFront[]

  ): ValidacionErrores => {
    const errores: ValidacionErrores = {};

    // Validación para la severidad
    if (![1, 2, 3, 4, 5].includes(severidadAnomalia)) {
      errores.severidadAnomalia = "Debe seleccionar una severidad válida.";
    }

    // Validación para la dimensión de la anomalía
    if (!dimensionAnomalia.trim()) {
      errores.dimensionAnomalia = "La dimensión de la anomalía es obligatoria.";
    } else if (dimensionAnomalia.length > 255) {
      errores.dimensionAnomalia = "La dimensión no puede tener más de 255 caracteres.";
    }

    // Validación para la orientación de la anomalía
    if (!orientacionAnomalia.trim()) {
      errores.orientacionAnomalia = "La orientación es obligatoria.";
    } else if (orientacionAnomalia.length > 255) {
      errores.orientacionAnomalia = "La orientación no puede tener más de 255 caracteres.";
    }

    // Validación para la descripción (obligatoria)
    if (!descripcionAnomalia.trim()) {
      errores.descripcionAnomalia = "La descripción de la anomalía es obligatoria.";
    }

    // Validación para la ubicación de la anomalía
    if (!ubicacionAnomalia.trim()) {
      errores.ubicacionAnomalia = "La ubicación de la anomalía es obligatoria.";
    }


    // Validación para las imágenes
    if (imagenes.length === 0) {
      errores.imagenesAnomalia= "Debe asociar al menos una imagen.";
    }

    return errores;
  };
