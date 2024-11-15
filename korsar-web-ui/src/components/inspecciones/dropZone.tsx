import { useDroppable } from '@dnd-kit/core';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

interface DropZoneProps {
  droppedImages: Imagen[];
  onRemoveImage: (imageId: Imagen) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ droppedImages, onRemoveImage }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'dropzone',
  });

  return (
      <div
        ref={setNodeRef}
        className={`w-full h-32 min-h-[150px] border-2 border-korsar-text-1 border-dashed rounded-lg flex justify-center items-center ${isOver ? 'bg-green-100' : ''}`}
      >

      {droppedImages.length === 0 ? (
        <p className='text-korsar-text-2'>Imagenes</p>
      ) : (
        <div className="flex flex-wrap space-x-4">
          {droppedImages.map((img) => (
            <div key={img.uuid_imagen} className="relative">
              <img
                src={img.ruta_imagen}
                alt={`Imagen ${img.uuid_imagen}`}
                className="w-16 h-16 object-cover rounded"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();  // Evita el submit
                  onRemoveImage(img);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                x
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
