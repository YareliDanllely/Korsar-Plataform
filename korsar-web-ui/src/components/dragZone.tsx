import { useEffect, useState } from "react";
import { useDraggable } from '@dnd-kit/core';
import { obtenerImagenesFiltradas } from '../services/imagenes';
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface DragZoneProps {
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_parque: string;
  onDragStart: (imagen: Imagen) => void;
}

export const DragZone: React.FC<DragZoneProps> = ({
  uuid_aerogenerador,
  uuid_componente,
  uuid_parque,
  onDragStart
}) => {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [selectedImage, setSelectedImage] = useState<Imagen | null>(null); // Imagen seleccionada para mostrar en grande
  const [carouselStartIndex, setCarouselStartIndex] = useState(0); // Controlar el índice del carrusel

  // Obtener imágenes filtradas
  useEffect(() => {
    const fetchImagenes = async () => {
      const data: Imagen[] = await obtenerImagenesFiltradas(uuid_aerogenerador, uuid_componente, uuid_parque);
      setImagenes(data);
      if (data.length > 0) setSelectedImage(data[0]); // Mostrar la primera imagen por defecto
    };

    fetchImagenes();
  }, [uuid_aerogenerador, uuid_componente, uuid_parque]);

  // Cambiar la imagen seleccionada
  const handleImageClick = (imagen: Imagen) => {
    setSelectedImage(imagen);
  };

  // Funciones para rotar el carrusel
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

  // Mover la imagen seleccionada al arrastrar
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: selectedImage?.uuid_imagen || '', // Usa el UUID de la imagen seleccionada
  });

  // Componente para manejar las imágenes en el carrusel
  const ImagenCarousel = ({ imagen }: { imagen: Imagen }) => {
    return (
      <div
        className={`p-1 cursor-pointer rounded-lg ${
          selectedImage?.uuid_imagen === imagen.uuid_imagen
            ? 'border-4 border-korsar-verde-brillante' // Borde ajustado si está seleccionada
            : ''
        }`} // Añadir borde si está seleccionada (solo en la pequeña)
        onClick={() => handleImageClick(imagen)} // Seleccionar imagen al hacer clic
      >
        <img
          src={imagen.ruta_imagen}
          alt={`Imagen ${imagen.uuid_imagen}`}
          className="w-20 h-20 object-cover rounded-lg" // Imagen redondeada, pero el borde será más visible
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Imagen Principal */}
      {selectedImage && (
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="w-full flex justify-center"
          onMouseDown={() => onDragStart(selectedImage)} // Arrastrar imagen grande
        >
          <img
            src={selectedImage.ruta_imagen}
            alt={`Imagen seleccionada ${selectedImage.uuid_imagen}`}
            className="w-96 h-96 object-cover cursor-move rounded-lg" // Imagen grande
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
            <ImagenCarousel key={imagen.uuid_imagen} imagen={imagen} />
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
