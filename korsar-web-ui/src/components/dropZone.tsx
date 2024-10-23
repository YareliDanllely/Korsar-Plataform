import { useDroppable } from '@dnd-kit/core';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface DropZoneProps {
  droppedImages: Imagen[];
  onRemoveImage: (imageId: string) => void;
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
                onClick={() => onRemoveImage(img.uuid_imagen)}
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
