import React, { useState, useEffect } from "react";

interface SelectorCategoriaProps {
  onCategoriaSelected: (number: number) => void;
  selectedCategoria?: number | null;
}

const SelectorCategoria: React.FC<SelectorCategoriaProps> = ({ onCategoriaSelected, selectedCategoria = null }) => {
  const [selected, setSelected] = useState<number | null>(selectedCategoria);

    const obtenerColor = (number: number): string => {
      const colores: Record<number, string> = {
        1: "bg-[#53AF0C]",
        2: "bg-[#34B0AD]",
        3: "bg-[#FCD023]",
        4: "bg-[#FF9500]",
        5: "bg-[#D9514E]",
      };
      return colores[number] || "bg-gray-200"; // Color por defecto
    };

    // Actualiza el estado `selected` cuando `selectedCategoria` cambie en el componente principal
    useEffect(() => {
      setSelected(selectedCategoria);
    }, [selectedCategoria]);

    const handleSelection = (number: number): void => {
      setSelected(number);
      onCategoriaSelected(number);
    };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        {[1, 2, 3, 4, 5].map((number) => (
          <div key={number} className="flex flex-col items-center">
            <button
              type="button"
              aria-selected={selected === number}
              onClick={() => handleSelection(number)}
              className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                selected === number ? "ring-4 ring-opacity-30 ring-korsar-turquesa-viento" : ""
              } ${obtenerColor(number)}`}
            ></button>
            <span className="mt-1 text-gray-700">{number}</span>
          </div>
        ))}
      </div>
      {selected !== null && (
        <p className="mt-4 text-korsar-text-2">Número seleccionado: {selected}</p>
      )}
    </div>
  );
};



export default SelectorCategoria;
