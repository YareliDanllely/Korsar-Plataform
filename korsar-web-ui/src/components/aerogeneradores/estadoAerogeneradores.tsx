import React, { useState } from 'react';

/**
 * Propiedades para el componente `EstadoAerogeneradores`
 * @interface TurbinaComponentesProps
 * @property {ColoresTurbina} colors - Colores de los componentes de la turbina.
 * @property {string} ancho - Ancho del componente.
 * @property {string} alto - Alto del componente.
 */

interface TurbinaComponentesProps {
  colores: ColoresTurbina;
  ancho: string;
  alto: string;
}


/**
 * Colores de los componentes de la turbina.
 * @interface ColoresTurbina
 * @property {string} torre - Color de la torre.
 * @property {string} heliceA - Color de la hélice A.
 * @property {string} heliceB - Color de la hélice B.
 * @property {string} heliceC - Color de la hélice C.
 */
interface ColoresTurbina {
  torre: string;
  heliceA: string;
  heliceB: string;
  heliceC: string;
  nacelle: string;
}


/**
 * Componente para visualizar el estado de los componentes de un aerogenerador.
 * @param {TurbinaComponentesProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un componente con la representación visual de un aerogenerador y los estados de sus componentes.
 */
const EstadoAerogeneradores: React.FC<TurbinaComponentesProps> = ({ colores, ancho, alto }) => {
  // Estado del tooltip
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const isDamage = (color: string) => color !== "#6ABF4B" && color !== "#5DAF3E";

/**
 *  Muestra informacion sobre el estado del componente seleccionado
 * @param componente Componente seleccionado
 * @param color Color del componente
 * @param evento Evento del mouse
 */
  const showTooltip = (componente: string, color: string, evento: React.MouseEvent<SVGElement, MouseEvent>) => {
    const hasDamage = isDamage(color);
    setTooltip({
      visible: true,
      text: `${componente}: ${hasDamage ? "Con daños" : "Sin daños"}`,
      x: evento.clientX,
      y: evento.clientY,
    });
  };

  /**
   * Oculta el tooltip
   */
  const hideTooltip = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            backgroundColor: tooltip.text.includes("Con daños") ? 'rgb(217, 81, 78, 0.8)' : 'rgb(83, 175, 12, 0.8)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '16px',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {tooltip.text}
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%" // Cambiado de ancho fijo a porcentual
        height="100%" // Cambiado de alto fijo a porcentual
        viewBox="0 0 462 640"
        preserveAspectRatio="xMidYMid meet" // Asegura que se escale proporcionalmente
        className="max-w-full max-h-full" // Asegura que no exceda el contenedor
      >

        <g clipPath="url(#a)">
          {/* Torre */}
          <g
            id="torre"
            onMouseEnter={(e) => showTooltip("Torre", colores.torre, e)}
            onMouseLeave={hideTooltip}
            style={{ cursor: 'pointer' }}
          >
            <path
              fill={colores.torre || "#F1F1F1"}
              d="M268.359 242.857c-9.421 0-17.128 2.572-17.128 5.714l-17.128 354.286c0 6.286 15.415 11.429 34.256 11.429 18.84 0 34.256-5.143 34.256-11.429l-17.128-354.286c0-3.142-7.708-5.714-17.128-5.714Z"
            />
            <path
              fill="#000"
              d="M271.334 254.286c-10.239 0-18.616-2.572-18.616-5.715l-18.615 354.286c0 6.286 16.754 11.429 37.231 11.429s37.231-5.143 37.231-11.429l-18.616-354.286c0 3.143-8.377 5.715-18.615 5.715Z"
              opacity=".05"
            />
          </g>

          {/* Nacelle */}
          <g
            id="nacelle"
            onMouseEnter={(e) => showTooltip("Nacelle", colores.nacelle, e)}
            onMouseLeave={hideTooltip}
            style={{ cursor: 'pointer' }}
          >
            <path
              fill={colores.nacelle || "#E5E5E5"}
              d="M263.404 271.429 237.737 260v-22.857l25.667 11.428v22.858Z"
            />
            <path
              fill={colores.nacelle || "#E5E5E5"}
              d="M309.233 204.34h-14.299l-57.197 26.835v26.836l28.599 13.418 71.496-33.545v-20.126l-28.599-13.418Z"
            />
            <path
              fill={colores.nacelle || "#E5E5E5"}
              d="m327.571 242.857-64.167 28.572v-22.858l64.167-22.857v17.143Z"
            />

            <path fill="#000" d="m263.404 273.361-25.667-14.136v-28.272l25.667 14.136v28.272Z" opacity=".06"/>
            <path fill="#000" d="m337.832 237.934-74.428 34.61v-27.688l59.542-27.688h14.886v20.766Z" opacity=".1"/>
          </g>

          {/* Hélice A */}
          <g
            id="heliceA"
            onMouseEnter={(e) => showTooltip("Hélice A", colores.heliceA, e)}
            onMouseLeave={hideTooltip}
            style={{ cursor: 'pointer' }}
          >
            <path
              fill={colores.heliceA || "#F1F1F1"}
              d="M435.343 373.503c-23.891-4.502-145.813-54.387-152.701-58.364-6.889-3.977-38.174-18.806-43.428-25.073-5.254-6.268-2.402-11.632 1.378-21.984 2.058-5.637 5.802-16.37 5.802-16.37l204.452 118.04s8.387 8.253-15.503 3.751Z"
            />

            <path fill="#000" d="M429.193 379.107c-23.444-4.704-140.754-48.832-147.556-52.759-6.803-3.928-37.647-18.662-42.887-24.761-5.241-6.1-4.843-15.561-1.311-25.436 1.923-5.378 9.027-24.527 9.027-24.527l205.945 119.249s.226 12.938-23.218 8.234Z" opacity=".05"/>


          </g>

          {/* Hélice B */}
          <g
            id="heliceB"
            onMouseEnter={(e) => showTooltip("Hélice B", colores.heliceB, e)}
            onMouseLeave={hideTooltip}
            style={{ cursor: 'pointer' }}
          >
            <path
              fill={colores.heliceB || "#F1F1F1"}
              d="M46.25 354.803c15.843-18.439 120.006-99.084 126.894-103.061 6.889-3.977 35.373-23.657 43.428-25.073 8.055-1.417 11.274 3.735 18.349 12.185 3.853 4.601 11.277 13.209 11.277 13.209L41.746 370.104s-11.341 3.137 4.503-15.301Z"
            />

            <path fill="#000" d="M44.471 346.675c15.797-17.95 112.667-97.478 119.47-101.405 6.802-3.928 34.985-23.273 42.887-24.761 7.903-1.489 15.897 3.586 22.683 11.581 3.696 4.354 16.727 20.079 16.727 20.079L39.992 370.899s-11.317-6.273 4.48-24.224Z" opacity=".05"/>

          </g>

          {/* Hélice C */}
          <g
            id="heliceC"
            onMouseEnter={(e) => showTooltip("Hélice C", colores.heliceC, e)}
            onMouseLeave={hideTooltip}
            style={{ cursor: 'pointer' }}
          >
            <path
              fill={colores.heliceC || "#F1F1F1"}
              d="M256.765 27.538c8.047 22.941 25.806 153.472 25.806 161.425 0 7.954 2.801 42.462 0 50.146-2.8 7.684-8.872 7.896-19.727 9.799-5.911 1.036-17.078 3.161-17.078 3.161V15.988s2.953-11.39 10.999 11.55Z"
            />

            <path fill="#000" d="M264.694 30.062c7.648 22.656 28.087 146.312 28.087 154.167 0 7.855 2.662 41.934 0 49.522-2.662 7.588-11.055 11.974-21.373 13.853-5.619 1.023-25.754 4.446-25.754 4.446l.3-237.978s11.092-6.665 18.74 15.99Z" opacity=".05"/>

          </g>
        </g>
      </svg>
    </div>
  );
};

export default EstadoAerogeneradores;

