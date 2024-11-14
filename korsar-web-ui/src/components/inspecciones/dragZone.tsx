import { useEffect, useState } from "react";
import { useDraggable } from '@dnd-kit/core';
import { obtenerImagenesFiltradas } from '../../services/imagenes';
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface DragZoneProps {
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_parque: string;
  onCreateAnomalia: boolean;
  onDragStart: (imagen: Imagen) => void;
}

export const DragZone: React.FC<DragZoneProps> = ({
  uuid_aerogenerador,
  uuid_componente,
  uuid_parque,
  onDragStart,
  onCreateAnomalia,
}) => {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [selectedImage, setSelectedImage] = useState<Imagen | null>(null);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  useEffect(() => {
    const fetchImagenes = async () => {
      const data: Imagen[] = await obtenerImagenesFiltradas(uuid_aerogenerador, uuid_componente, uuid_parque);
      setImagenes(data);
      if (data.length > 0) setSelectedImage(data[0]);
    };

    fetchImagenes();
  }, [uuid_aerogenerador, uuid_componente, uuid_parque]);

  const handleImageClick = (imagen: Imagen) => {
      setSelectedImage(imagen);

  };

  const handleNext = () => {
    if (carouselStartIndex < imagenes.length - 4) {
      setCarouselStartIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (carouselStartIndex > 0) {
      setCarouselStartIndex((prev) => prev - 1);
    }
  };

  // Configura la funcionalidad de arrastre para la imagen seleccionada
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: selectedImage?.uuid_imagen || '',
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Imagen Principal */}
      {selectedImage && (
        <div
          ref={onCreateAnomalia ? setNodeRef : undefined} // Aplica la referencia solo si onCreateAnomalia es true
          {...(onCreateAnomalia ? listeners : {})} // Aplica los listeners solo si onCreateAnomalia es true
          {...(onCreateAnomalia ? attributes : {})} // Aplica los attributes solo si onCreateAnomalia es true
          className={`w-full flex justify-center ${onCreateAnomalia ? 'cursor-move' : ''}`} // Solo muestra el cursor de mover si onCreateAnomalia es true
          onMouseDown={() => onCreateAnomalia && onDragStart(selectedImage)} // Llama a onDragStart solo si onCreateAnomalia es true
        >
          <img
            src={selectedImage.ruta_imagen}
            alt={`Imagen seleccionada ${selectedImage.uuid_imagen}`}
            className="w-96 h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Mini Carrusel */}
      <div className="w-full flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={carouselStartIndex === 0}
          className={`p-2 ${carouselStartIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <HiArrowCircleLeft className="text-4xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>

        <div className="flex space-x-2 overflow-hidden">
          {imagenes.slice(carouselStartIndex, carouselStartIndex + 4).map((imagen) => (
            <div
              key={imagen.uuid_imagen}
              className={`p-1 cursor-pointer rounded-lg ${
                selectedImage?.uuid_imagen === imagen.uuid_imagen
                  ? 'border-4 border-korsar-verde-brillante'
                  : ''
              }`}
              onClick={() => handleImageClick(imagen)}
            >
              <img
                src={imagen.ruta_imagen}
                alt={`Imagen ${imagen.uuid_imagen}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={carouselStartIndex >= imagenes.length - 4}
          className={`p-2 ${carouselStartIndex >= imagenes.length - 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <HiArrowCircleRight className="text-4xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>
      </div>
    </div>
  );
};
