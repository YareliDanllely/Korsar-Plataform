import { TextInput, Textarea } from "flowbite-react";
import SelectorCategoria from "./selectorCategoria";
import { DropZone } from "./dropZone"; // Importa el DropZone

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface FormularioAnomaliasProps {
  droppedImages: Imagen[]; // Recibe las imágenes desde el abuelo
  onRemoveImage: (imageId: string) => void; // Recibe la función para eliminar una imagen
}

export function FormularioAnomalias({ droppedImages, onRemoveImage }: FormularioAnomaliasProps) {
  return (
    <div className="flex flex-col p-2 space-y-4">
      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Seleccionar Severidad</h2>
      <ul className="text-korsar-text-2">
        <li>1- Sin daño</li>
        <li>2- Daño menor</li>
        <li>3- Daño significativo</li>
        <li>4- Daño mayor</li>
        <li>5- Daño crítico</li>
      </ul>

      <div className="flex w-full flex-row">
        <SelectorCategoria />
      </div>
      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Orientación de la Anomalía</h2>
      <p className="text-korsar-text-1">Ingrese la ubicación u orientación del daño en el componente</p>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Orientación</h2>
        <div className="w-[350px]">
          <TextInput id="orientacion-anomalia" placeholder="" required />
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Descripción de la Anomalía</h2>
      <p className="text-korsar-text-1">Proporcione detalles específicos sobre el daño observado</p>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Dimensión</h2>
        <div className="w-[350px]">
          <TextInput id="dimension-anomalia" placeholder="" required />
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Descripción</h2>
        <div className="w-[350px] h-[90px]">
          <Textarea id="descripcion-anomalia" placeholder="" required rows={3} className="w-full h-full resize-none" />
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg text-korsar-negro-90 mb-1">Observaciones</h2>
        <div className="w-[350px] h-[90px]">
          <Textarea id="observacion-anomalia" placeholder="" required rows={3} className="w-full h-full resize-none" />
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl text-korsar-negro-90 font-semibold mb-1">Asociación de Imágenes</h2>
      <p className="text-korsar-text-1">Arrastre todas las imágenes asociadas a esta anomalía</p>

      {/* DropZone */}
      <DropZone droppedImages={droppedImages} onRemoveImage={onRemoveImage} />
    </div>
  );
}

export default FormularioAnomalias;
