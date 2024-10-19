import { useState } from "react";

interface DropZoneProps {
  onIdsAdded: (ids: string[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onIdsAdded }) => {
  const [imageIds, setImageIds] = useState<string[]>([]);

  // Manejar el evento cuando una imagen es soltada
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const imageId = event.dataTransfer.getData('text/plain'); // Obtener el ID arrastrado
    if (imageId) {
      setImageIds((prevIds) => [...prevIds, imageId]); // Añadir el ID al estado
      onIdsAdded([imageId]); // Notificar al componente padre
      console.log("Imagen soltada con ID:", imageId);
    }
  };

  return (
    <div
      className="w-full border-2 border-dashed rounded-lg p-5 cursor-pointer"
      onDragOver={(e) => e.preventDefault()} // Permitir el arrastre
      onDrop={handleDrop} // Manejar cuando se suelta la imagen
    >
      <p>Arrastra las imágenes aquí o haz clic para seleccionarlas.</p>

      {/* Previsualización de IDs de imágenes */}
      <div className="mt-4">
        {imageIds.map((id, index) => (
          <div key={index}>
            <p>ID de la imagen: {id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropZone;
