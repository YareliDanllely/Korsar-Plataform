import { useState } from "react";

const SelectorCategoria = () => {
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelection = (number: number): void => {
        setSelected(number);
    };

    return (
        <div className="flex flex-col items-center">
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((number) => (
              <div key={number} className="flex flex-col items-center">
                <div
                  onClick={() => handleSelection(number)}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    selected === number ? "ring-4 ring-opacity-30 ring-korsar-turquesa-viento" : ""
                  } ${getColorClass(number)}`}
                ></div>
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

const getColorClass = (number: number) => {
    switch (number) {
        case 1:
            return "bg-korsar-verde-brillante";
        case 2:
            return "bg-korsar-turquesa-viento";
        case 3:
            return "bg-korsar-amarillo-dorado";
        case 4:
            return "bg-korsar-naranja-brillante";
        case 5:
            return "bg-korsar-naranja-sol";
        default:
            return "";
    }
};

export default SelectorCategoria;
