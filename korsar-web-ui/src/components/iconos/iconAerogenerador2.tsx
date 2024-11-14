import React, { useState } from 'react';

// Define the structure for custom color settings
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

interface Props {
  colors: TurbineColors;
  width: string;
  height: string;
}

const IconAerogeneradorDos: React.FC<Props> = ({ colors, width, height }) => {
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
        viewBox="0 0 512 542"
        fill="none"
      >
        {/* Tower */}
        <g
          id="torre"
          onMouseEnter={(e) => showTooltip("Torre", colors.torre1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path
            fill={colors.torre1 || "#F0F0F0"}
            fillRule="evenodd"
            d="M205.759 230.198c11.604 15.077 23.317 15.077 34.92 0l2.266-2.945 11.057 286.679h-61.565l11.056-286.679 2.266 2.945Z"
            clipRule="evenodd"
          />
          <path
            fill={colors.torre2 || "#E8E8E8"}
            fillRule="evenodd"
            d="M217.359 254.693c7.325 0 14.651-3.587 21.942-10.761l2.847-2.802 13.896 272.802h-38.685V254.693Z"
            clipRule="evenodd"
          />
        </g>

        {/* Blade A */}
        <g
          id="heliceA"
          onMouseEnter={(e) => showTooltip("Hélice A", colors.heliceA1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path
            fill={colors.heliceA1 || "#F0F0F0"}
            fillRule="evenodd"
            d="M223.219 248.666c-12.73-11.653-20.878-23.418-16.103-41.24.186-.697.654-3.007.871-3.687-64.901 8.657-107.026 21.804-181.969 56.758-7.587 3.536-27.417 15.92-25.25 24.005 2.166 8.086 30.401 4.912 38.74 4.181 82.376-7.202 123.183-15.068 183.711-40.017Z"
            clipRule="evenodd"
          />
          <path
            fill={colors.heliceA2 || "#E8E8E8"}
            fillRule="evenodd"
            d="M204.488 229.02c-2.37-8.901.23-16.305 3-25.087-64.901 8.749-104.659 20.444-180.982 56.393C18.92 263.9-1.25 276.02.917 284.191l203.571-55.171Z"
            clipRule="evenodd"
          />
        </g>

        {/* Blade B */}
        <g
          id="heliceB"
          onMouseEnter={(e) => showTooltip("Hélice B", colors.heliceB1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path
            fill={colors.heliceB1 || "#F0F0F0"}
            fillRule="evenodd"
            d="M193.548 226.419c14.55-9.28 28.023-14.106 44.002-4.881.625.36 2.735 1.41 3.336 1.796 8.436-64.931 6.639-109.022-7.727-190.458-1.452-8.244-8.282-30.604-16.653-30.603-8.371 0-12.612 28.094-14.064 36.338-14.364 81.433-17.327 122.885-8.894 187.808Z"
            clipRule="evenodd"
          />
          <path
            fill={colors.heliceB2 || "#E8E8E8"}
            fillRule="evenodd"
            d="M218.52 211.817c9.204.041 15.69 4.441 23.465 9.358 8.156-64.24 7.032-105.233-8.163-187.421-1.511-8.17-8.058-30.567-16.505-30.612l1.203 208.675Z"
            clipRule="evenodd"
          />
        </g>

        {/* Blade C */}
        <g
          id="heliceC"
          onMouseEnter={(e) => showTooltip("Hélice C", colors.heliceC1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path
            fill={colors.heliceC1 || "#F0F0F0"}
            fillRule="evenodd"
            d="M229.672 248.859c12.73-11.653 20.878-23.417 16.103-41.239-.186-.697-.654-3.007-.871-3.687 64.901 8.657 107.026 21.804 181.969 56.758 7.587 3.536 27.417 15.92 25.25 24.005-2.166 8.086-30.401 4.911-38.74 4.18-82.376-7.202-123.183-15.068-183.711-40.017Z"
            clipRule="evenodd"
          />
          <path
            fill={colors.heliceC2 || "#E8E8E8"}
            fillRule="evenodd"
            d="M248.554 228.826c2.37-8.901-.23-16.304-3-25.087 64.901 8.749 104.659 20.444 180.982 56.393 7.587 3.574 27.756 15.695 25.589 23.865l-203.571-55.171Z"
            clipRule="evenodd"
          />
        </g>

        {/* Nacelle */}
        <g
          id="nacelle"
          onMouseEnter={(e) => showTooltip("Nacelle", colors.nacelle1, e)}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <path
            fill={colors.nacelle1 || "#20AAFF"}
            d="M219.96 263.26c19.929 0 36.084-16.121 36.084-36.007s-16.155-36.007-36.084-36.007c-19.929 0-36.084 16.121-36.084 36.007s16.155 36.007 36.084 36.007Z"
          />
          <path
            fill={colors.nacelle2 || "#1E90FF"}
            d="M225.319 249.899c12.534-2.953 20.295-15.486 17.336-27.993-2.96-12.508-15.52-20.253-28.054-17.299-12.534 2.953-20.295 15.486-17.336 27.994 2.96 12.507 15.52 20.252 28.054 17.298Z"
          />
        </g>

        {/* Base */}
        <g id="base">
          <path
            fill={colors.base1 || "#E8E8E8"}
            fillRule="evenodd"
            d="M164.389 533.652H281.41c1.389-.003 2.72-.464 3.702-1.284.982-.82 1.535-1.931 1.538-3.09v-13.744c0-5.053-4.952-9.186-11.004-9.186H170.153c-6.053 0-11.004 4.134-11.004 9.186v13.744c.003 1.159.556 2.27 1.538 3.09.982.82 2.313 1.281 3.702 1.284Z"
            clipRule="evenodd"
          />
          <path
            fill={colors.base2 || "#D9D9D9"}
            fillRule="evenodd"
            d="M224.6 533.652h58.511c1.389-.003 2.72-.464 3.702-1.284.982-.82 1.535-1.931 1.538-3.09v-13.744c0-5.053-4.952-9.186-11.004-9.186H224.6v27.304Z"
            clipRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
};

export default IconAerogeneradorDos;
