import { ValidacionErrores } from "../utils/interfaces";
import { ImagenAnomaliaFront } from "../utils/interfaces";
export const validarFormularioAnomalia = (
  severidadAnomalia?: number,
  dimensionAnomalia?: string,
  orientacionAnomalia?: string,
  descripcionAnomalia?: string,
  imagenes?: ImagenAnomaliaFront[]
): ValidacionErrores => {
  const errores: ValidacionErrores = {};

  if (severidadAnomalia !== undefined && ![1, 2, 3, 4, 5].includes(severidadAnomalia)) {
      errores.severidadAnomalia = "Debe seleccionar una severidad válida.";
  }

  if (dimensionAnomalia !== undefined) {
      if (!dimensionAnomalia.trim()) {
          errores.dimensionAnomalia = "La dimensión de la anomalía es obligatoria.";
      } else if (dimensionAnomalia.length > 255) {
          errores.dimensionAnomalia = "La dimensión no puede tener más de 255 caracteres.";
      }
  }

  if (orientacionAnomalia !== undefined) {
      if (!orientacionAnomalia.trim()) {
          errores.orientacionAnomalia = "La orientación es obligatoria.";
      } else if (orientacionAnomalia.length > 255) {
          errores.orientacionAnomalia = "La orientación no puede tener más de 255 caracteres.";
      }
  }

  if (descripcionAnomalia !== undefined && !descripcionAnomalia.trim()) {
      errores.descripcionAnomalia = "La descripción de la anomalía es obligatoria.";
  }


  if (imagenes && imagenes.length === 0) {
      errores.imagenesAnomalia = "Debe asociar al menos una imagen.";
  }

  return errores;
};
