import { useEffect, useState } from 'react';
import { Carousel } from 'flowbite-react';
import { obtenerImagenesFiltradas } from '../services/imagenes';
import { Imagen } from '../interfaces';
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";

interface CarruselImagenesProps {
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_parque: string;
  onImageSelect: (ids: string[]) => void; // Función que se llamará cuando una imagen sea seleccionada
}

const CarruselImagenes: React.FC<CarruselImagenesProps> = ({
  uuid_aerogenerador,
  uuid_componente,
  uuid_parque,
  onImageSelect,
}) => {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);

  useEffect(() => {
    const fetchImagenes = async () => {
      const data: Imagen[] = await obtenerImagenesFiltradas(uuid_aerogenerador, uuid_componente, uuid_parque);
      setImagenes(data);
    };

    fetchImagenes();
  }, [uuid_aerogenerador, uuid_componente, uuid_parque]);

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>, id: string) => {
    console.log(`Iniciando arrastre de la imagen con ID: ${id}`);
    event.dataTransfer.setData('text/plain', id); // Establecer el ID de la imagen
    onImageSelect([id]); // Pasar el ID al componente padre
  };

  return (
    <div className="w-full h-64 mt-4">
      <Carousel
        slide={false}
        leftControl={<HiArrowCircleLeft className="h-8 w-8 text-korsar-azul-agua opacity-40" />}
        rightControl={<HiArrowCircleRight className="h-8 w-8 text-korsar-azul-agua opacity-40" />}
      >
        {imagenes.map((imagen) => (
          <div key={imagen.uuid_imagen}>
            <img
              src={imagen.ruta_imagen}
              alt={imagen.nombre_imagen}
              className="w-full h-full object-cover"
              draggable="true" // Habilitar arrastrar
              onDragStart={(e) => handleDragStart(e, imagen.uuid_imagen)} // Manejar el evento de arrastre
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarruselImagenes;
