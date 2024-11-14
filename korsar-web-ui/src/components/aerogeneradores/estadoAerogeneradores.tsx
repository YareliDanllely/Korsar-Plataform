import React, { useState } from 'react';

// Define la estructura para el objeto de colores personalizados
interface TurbineColors {
  torre1: string;
  torre2: string;
  base1: string;
  base2: string;
  heliceA1: string;
  heliceA2: string;
  heliceB1: string;
  heliceB2: string;
  heliceC1: string;
  heliceC2: string;
  nacelle1: string;
  nacelle2: string;
}

interface TurbineComponentProps {
  colors: TurbineColors;
  width: string;
  height: string;
}

const TurbineComponent: React.FC<TurbineComponentProps> = ({ colors, width, height }) => {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const isDamage = (color: string) => color !== "#6ABF4B" && color !== "#5DAF3E";

  const showTooltip = (component: string, color: string, event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const hasDamage = isDamage(color);
    setTooltip({
      visible: true,
      text: `${component}: ${hasDamage ? "Con daños" : "Sin daños"}`,
      x: event.clientX,
      y: event.clientY,
    });
  };

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
        width={width}
        height={height}
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Torre */}
        <g
          id="torre"
          onMouseEnter={(e) => showTooltip("Torre", colors.torre1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path fill={colors.torre1 || "#F0F0F0"} d="M258.631 282.341c15.265 10.152 30.674 10.152 45.938 0l2.981-1.983 14.546 193.031h-80.992l14.546-193.031 2.981 1.983Z" />
          <path fill={colors.torre2 || "#E8E8E8"} d="M281.6 289.955c7.668 0 15.337-2.538 22.969-7.614l2.981-1.983 14.546 193.031H281.6V289.955Z" />
        </g>

        {/* Base (sin tooltip) */}
        <g id="base">
          <path fill={colors.base1 || "#E8E8E8"} d="M223.089 504.002H340.11a5.251 5.251 0 0 0 5.24-5.24v-16.465c0-6.053-4.952-11.004-11.004-11.004H228.853c-6.053 0-11.004 4.952-11.004 11.004v16.465a5.251 5.251 0 0 0 5.24 5.24Z" />
          <path fill={colors.base2 || "#D9D9D9"} d="M281.6 504.002h58.511a5.251 5.251 0 0 0 5.24-5.24v-16.465c0-6.053-4.952-11.004-11.004-11.004H281.6v32.709Z" />
        </g>

        {/* Hélice A */}
        <g
          id="heliceA"
          onMouseEnter={(e) => showTooltip("Hélice A", colors.heliceA1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path fill={colors.heliceA1 || "#6ABF4B"} d="M297.482 196.403c9.15 2.452 16.966 7.4 22.909 13.916 24.952-60.531 32.818-101.337 40.019-183.713.731-8.339-4.52-15.839-12.606-18.006s-16.384 1.703-19.92 9.291C292.932 92.83 279.341 132.103 270.684 197a47.565 47.565 0 0 1 26.798-.597Z" />
          <path fill={colors.heliceA2 || "#5DAF3E"} d="M297.481 196.403c9.151 2.452 16.966 7.4 22.909 13.916 24.952-60.531 32.818-101.337 40.019-183.713.731-8.339-4.52-15.839-12.606-18.006l-50.322 187.803Z" />
          <text x="230" y="120" fontSize="24" fill="#43454B" textAnchor="middle" dominantBaseline="middle">Aspa A</text>

        </g>


        {/* Hélice B */}
        <g
          id="heliceB"
          onMouseEnter={(e) => showTooltip("Hélice B", colors.heliceB1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path fill={colors.heliceB1 || "#6ABF4B"} d="M331.269 254.923c-4.776 17.822-19.02 30.578-35.872 34.303a663.722 663.722 0 0 0 11.847 14.959c34.787 42.597 66.322 68.903 127.242 111.554 6.856 4.802 15.978 4.005 21.897-1.914 5.919-5.919 6.716-15.04 1.914-21.896-47.426-67.742-74.643-99.148-126.518-139.096-.155.7-.325 1.397-.51 2.09Z" />
          <path fill={colors.heliceB2 || "#5DAF3E"} d="M318.908 276.347a47.988 47.988 0 0 1-23.511 12.88 663.722 663.722 0 0 0 11.847 14.959c34.787 42.597 66.322 68.903 127.242 111.554 6.856 4.802 15.978 4.005 21.897-1.914L318.908 276.347Z" />
          <text x="450" y="290" fontSize="24" fill="#43454B" textAnchor="middle" dominantBaseline="middle">Aspa B</text>

        </g>

        {/* Hélice C */}
        <g
          id="heliceC"
          onMouseEnter={(e) => showTooltip("Hélice C", colors.heliceC1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path fill={colors.heliceC1 || "#6ABF4B"} d="M252.874 277.835c-12.73-11.653-18.688-29.823-13.913-47.645.186-.697.388-1.385.605-2.065-64.901 8.657-104.175 22.247-179.118 57.201-7.587 3.536-11.458 11.835-9.291 19.92 2.166 8.086 9.667 13.337 18.006 12.606 82.376-7.202 123.183-15.068 183.711-40.017Z" />
          <path fill={colors.heliceC2 || "#5DAF3E"} d="M238.954 254.925a47.567 47.567 0 0 1 .612-26.801c-64.901 8.657-104.175 22.247-179.118 57.201-7.587 3.536-11.458 11.835-9.291 19.92l187.797-50.32Z" />
          <text x="100" y="350" fontSize="24" fill="#43454B" textAnchor="middle" dominantBaseline="middle">Aspa C</text>


        </g>

        {/* Nacelle */}
        <g
          id="nacelle"
          onMouseEnter={(e) => showTooltip("Nacelle", colors.nacelle1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path fill={colors.nacelle1 || "#FFE469"} d="M285.115 292.442c27.551 0 49.886-22.335 49.886-49.886 0-27.551-22.335-49.886-49.886-49.886-27.551 0-49.886 22.335-49.886 49.886 0 27.551 22.335 49.886 49.886 49.886Z" />
          <path fill={colors.nacelle2 || "#FFDA30"} d="M292.532 273.915c17.328-4.092 28.058-21.456 23.966-38.784-4.092-17.328-21.456-28.058-38.784-23.966-17.328 4.091-28.058 21.455-23.966 38.783 4.091 17.328 21.456 28.059 38.784 23.967Z" />
        </g>
      </svg>
    </div>
  );
};

export default TurbineComponent;
