import React from 'react';

interface IconWithBackgroundProps {
  color: string; // Color principal para el fondo
  size: number; // Tamaño del SVG (ancho y alto)
  name: string; // Nombre que aparecerá sobre el marcador
  isSelected?: boolean; // Si el marcador está seleccionado
}

const MarcadorMapa: React.FC<IconWithBackgroundProps> = ({
  color,
  size,
  name,
  isSelected = false,
}) => {
  const iconColor = '#183859'; // Ícono en color negro

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size + 30, // Espacio adicional para el nombre
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Nombre encima del marcador */}
      <div
        style={{
          position: 'absolute',
          top: -12, // Coloca el texto más arriba del marcador
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo semitransparente
          borderRadius: '8px', // Bordes redondeados
          padding: '2px 6px', // Espaciado interno
          fontSize: '12px', // Tamaño de fuente
          fontWeight: '600', // Peso de fuente
          color: '#183859', // Color del texto
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Sombra para un efecto flotante
          whiteSpace: 'nowrap', // Evita que el texto se corte en múltiples líneas
          zIndex: 10,
        }}
      >
        {name}
      </div>

      {/* Fondo circular con efecto de aura si está seleccionado */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        style={{
          position: 'absolute',
          zIndex: 0,
          borderRadius: '50%',
          boxShadow: isSelected
            ? '0 0 3px 3px rgba(52, 176, 173, 0.5)' // Efecto de "aura" para el marcador seleccionado
            : 'none',
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={color}
          opacity={0.7}
        />
      </svg>

      {/* Ícono principal */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size * 0.8}
        height={size * 0.8}
        viewBox="0 0 256 256"
        fill="none"
        style={{
          zIndex: 1,
        }}
      >
        <path
          fill={iconColor}
          d="M306.161 221.168C305.156 216.988 303.323 212.901 301.804 208.877 292.937 185.375 294.374 171.19 297.331 147.471L304.496 87.4254C305.974 73.9973 304.583 55.3865 321.524 52.2696 343.72 50.835 342.463 67.1821 345.16 83.7709L350.879 119.846C353.229 134.793 356.457 149.821 358.096 164.851 360.745 189.146 346.99 200.008 341.98 221.263L341.876 221.713C338.638 221.291 335.406 220.65 332.191 220.079 323.504 218.916 314.748 219.666 306.161 221.168zM325.552 313.474C314.517 314.153 304.695 311.162 296.07 304.117 267.278 280.598 283.327 234.425 319.186 231.377 369.433 227.014 381.096 306.34 325.552 313.474zM161.102 355.776C146.479 359.332 122.871 367.677 120.793 342.941 119.523 327.814 133.323 323.331 144.2 317.139L196.768 287.791C211.075 280.083 218.741 276.585 235.356 275.445 246.498 274.924 257.662 276.033 268.753 275.543 269.991 289.687 272.575 294.546 280.767 305.871 269.209 313.188 260.364 324.647 248.584 331.868 232.458 341.752 182.065 350.471 161.102 355.776zM362.923 304.581C370.426 296.164 374.542 286.544 374.982 275.292 417.192 276.386 417.304 271.529 454.547 291.789L506.449 320.263C517.702 326.394 530.203 331.974 524.678 347.831 522.667 353.604 518.081 357.253 512.736 359.798 505.614 362.492 496.511 358.418 489.498 356.766L452.258 347.885C437.727 344.372 413.571 340.552 401.266 334.602 391.633 329.944 370.627 313.378 362.923 304.581zM287.052 543.864C287.571 529.914 288.658 516.063 289.593 502.143L295.411 418.312C297.311 388.889 297.844 352.16 302.238 323.337 316.984 325.916 325.233 326.88 340.389 323.612 341.782 331.784 341.878 340.52 342.43 348.803L355.963 543.704C365.94 543.956 375.956 543.814 385.937 543.795 393.863 543.78 408.192 541.734 408.494 553.643 408.846 567.466 390.838 564.178 382.168 564.167L343.699 564.18 256.283 564.188C250.762 564.187 242.143 565.449 237.737 561.302 231.863 555.773 234.808 545.758 242.58 544.297 247.843 543.308 253.758 543.786 259.124 543.783L287.052 543.864z"
          transform="scale(.4)"
        />
      </svg>
    </div>
  );
};

export default MarcadorMapa;