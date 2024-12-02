import { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { obtenerImagenesFiltradas } from "../../../services/imagenes";
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface DragZoneProps {
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  onCreateAnomalia: boolean;
  onDragStart: (imagen: Imagen) => void;
}

export const DragZone: React.FC<DragZoneProps> = ({
  uuid_aerogenerador,
  uuid_componente,
  uuid_inspeccion,
  onDragStart,
  onCreateAnomalia,
}) => {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [selectedImage, setSelectedImage] = useState<Imagen | null>(null);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false); // Controla el estado del modal
  const [zoomLevel, setZoomLevel] = useState(1); // Controla el nivel de zoom

  useEffect(() => {
    const fetchImagenes = async () => {
      const data: Imagen[] = await obtenerImagenesFiltradas(
        uuid_aerogenerador,
        uuid_componente,
        uuid_inspeccion
      );
      setImagenes(data);
      if (data.length > 0) setSelectedImage(data[0]);
    };

    fetchImagenes();
  }, [uuid_aerogenerador, uuid_componente, uuid_inspeccion]);

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
    id: selectedImage?.uuid_imagen || "",
  });

  const handleOpenModal = () => {
    setOpenModal(true);
    setZoomLevel(1); // Restablece el nivel de zoom al abrir el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.2);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => (prevZoom > 1 ? prevZoom - 0.2 : 1));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Imagen Principal */}
      {selectedImage && (
        <div
          ref={onCreateAnomalia ? setNodeRef : undefined}
          {...(onCreateAnomalia ? listeners : {})}
          {...(onCreateAnomalia ? attributes : {})}
          className={`relative w-full flex justify-center ${
            onCreateAnomalia ? "cursor-move" : ""
          }`}
          onMouseDown={() =>
            onCreateAnomalia && onDragStart(selectedImage)
          }
        >
          <img
            src={selectedImage.ruta_imagen}
            alt={`Imagen seleccionada ${selectedImage.uuid_imagen}`}
            className="w-96 h-96 object-cover rounded-lg"
          />
          <button
            onClick={handleOpenModal}
            className="absolute right-2 bg-white p-1 rounded-full shadow-md hover:scale-130 transition-transform"
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
        </div>
      )}

      {/* Mini Carrusel */}
      <div className="w-full flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={carouselStartIndex === 0}
          className={`p-2 ${
            carouselStartIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <HiArrowCircleLeft className="text-4xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>

        <div className="flex space-x-2 overflow-hidden">
          {imagenes
            .slice(carouselStartIndex, carouselStartIndex + 4)
            .map((imagen) => (
              <div
                key={imagen.uuid_imagen}
                className={`p-1 cursor-pointer rounded-lg ${
                  selectedImage?.uuid_imagen === imagen.uuid_imagen
                    ? "border-4 border-korsar-verde-brillante"
                    : ""
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
          className={`p-2 ${
            carouselStartIndex >= imagenes.length - 4
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <HiArrowCircleRight className="text-4xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>
      </div>

      {/* Modal para la imagen ampliada */}
      <Modal show={openModal} size="6xl" onClose={handleCloseModal}>
        <Modal.Header>Imagen ampliada</Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="flex flex-col items-center">
              <div
                className="overflow-hidden"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <img
                  src={selectedImage.ruta_imagen}
                  alt={`Imagen ampliada ${selectedImage.uuid_imagen}`}
                  className="max-w-full max-h-[80vh] object-scale-down"
                />
              </div>

            </div>
          )}
        </Modal.Body>
          <Modal.Footer>
                      <div className="relative w-full flex items-center">
                        {/* Botones de Zoom centrados */}
                        <div className="flex justify-center w-full space-x-4">
                          <Button onClick={handleZoomIn}>Zoom +</Button>
                          <Button onClick={handleZoomOut} color="gray">
                            Zoom -
                          </Button>
                        </div>

                        {/* Botón de Cerrar en la esquina derecha */}
                        <div className="absolute top-0 right-4">
                          <Button onClick={handleCloseModal} color="gray">
                            Cerrar
                          </Button>
                        </div>
                      </div>
         </Modal.Footer>

      </Modal>
    </div>
  );
};
