import React, { useState } from 'react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface CarruselProps {
  imagenes: Imagen[];
}

const CarruselImagenes: React.FC<CarruselProps> = ({ imagenes }) => {
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const visibleItems = 3; // Número de imágenes visibles en el carrusel

  const handlePrevious = () => {
    if (carouselStartIndex > 0) {
      setCarouselStartIndex(carouselStartIndex - 1);
    }
  };

  const handleNext = () => {
    if (carouselStartIndex < imagenes.length - visibleItems) {
      setCarouselStartIndex(carouselStartIndex + 1);
    }
  };

  return (
    <div className="relative w-full flex items-center space-x-4 mt-4 overflow-auto">
      {/* Botón Anterior */}
      <button
        onClick={handlePrevious}
        disabled={carouselStartIndex === 0}
        className={`absolute left-0 z-10 p-2 ${
          carouselStartIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ transform: 'translateY(-50%)' }}
      >
        <HiArrowCircleLeft className="text-6xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
      </button>

      {/* Carrusel de Imágenes */}
      <div className="flex justify-center items-center space-x-4 overflow-hidden w-full">
        {imagenes.slice(carouselStartIndex, carouselStartIndex + visibleItems).map((imagen) => (
          <div key={imagen.uuid_imagen} className="flex flex-col items-center">
            <img
              src={imagen.ruta_imagen}
              alt={`Imagen ${imagen.uuid_imagen}`}
              className="w-80 h-80 object-cover rounded-lg shadow-md" // Tamaño de la imagen aumentado
            />
          </div>
        ))}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        disabled={carouselStartIndex >= imagenes.length - visibleItems}
        className={`absolute right-0 z-10 p-1 ${
          carouselStartIndex >= imagenes.length - visibleItems ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ transform: 'translateY(-50%)' }}
      >
        <HiArrowCircleRight className="text-6xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
      </button>
    </div>
  );
};

export default CarruselImagenes;
