

import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface CarruselProps {
  imagenes: Imagen[];
}

const CarruselImagenes: React.FC<CarruselProps> = ({ imagenes }) => {
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Imagen | null>(null);

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

  const handleOpenModal = (imagen: Imagen) => {
    setSelectedImage(imagen);
    setOpenModal(true);
  };

  return (
    <div className="relative w-full flex flex-col items-center space-y-4 mt-4">
      {/* Carrusel */}
      <div className="relative w-full flex items-center space-x-4 overflow-hidden">
        {/* Botón Anterior */}
        <button
          onClick={handlePrevious}
          disabled={carouselStartIndex === 0}
          className={`absolute left-0 z-10 p-2 ${
            carouselStartIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carrusel de Imágenes */}
        <div className="flex justify-center items-center space-x-4 overflow-hidden w-full">
          {imagenes.slice(carouselStartIndex, carouselStartIndex + visibleItems).map((imagen) => (
            <div key={imagen.uuid_imagen} className="relative">
              {/* Botón de agrandar */}
              <button
                onClick={() => handleOpenModal(imagen)}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:scale-110 transition-transform"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"
                  />
                </svg>
              </button>
              <img
                src={imagen.ruta_imagen}
                alt={`Imagen ${imagen.uuid_imagen}`}
                className="w-97 h-96 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          disabled={carouselStartIndex >= imagenes.length - visibleItems}
          className={`absolute right-0 z-10 p-2 ${
            carouselStartIndex >= imagenes.length - visibleItems
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Modal */}
      <Modal show={openModal} size="xl" onClose={() => setOpenModal(false)}>
        <Modal.Header>Imagen ampliada</Modal.Header>
        <Modal.Body>
          <div className="flex justify-center items-center">
            {selectedImage && (
              <img
                src={selectedImage.ruta_imagen}
                alt={`Imagen ${selectedImage.uuid_imagen}`}
                className="max-w-screen-lg max-h-screen object-contain"
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarruselImagenes;
