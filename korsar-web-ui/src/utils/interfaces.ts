// src/interfaces/

export interface Anomalia {
    uuid_anomalia: string;          // UUID como string en TypeScript
    uuid_aerogenerador: string;      // Relación de ForeignKey representada como UUID string
    uuid_componente: string;         // Relación de ForeignKey representada como UUID string
    uuid_inspeccion: string;         // Relación de ForeignKey representada como UUID string
    uuid_tecnico: string | null;     // ForeignKey opcional, representada como UUID string o null

    codigo_anomalia: string;         // CharField en Django mapeado a string

    severidad_anomalia: number;      // IntegerField para choices, se mantiene como number en TypeScript

    dimension_anomalia: string;      // CharField mapeado a string
    // ubicacion_componente: string;      // CharField mapeado a string
    orientacion_anomalia: string;    // CharField mapeado a string
    descripcion_anomalia: string;   // TextField, opcional en TypeScript

  }

export interface InspeccionFront {
  uuid_inspeccion: string;
  uuid_parque_eolico: string; // UUID del parque
  fecha_inspeccion: string | null; // Fecha en formato ISO
  fecha_siguiente_inspeccion: string | null; // Fecha en formato ISO o null
}


  export interface Inspeccion {
    uuid_inspeccion: string;
    uuid_parque_eolico: string;
    nombre_parque: string;
    fecha_inspeccion: string;
    fecha_siguiente_inspeccion: string;
    progreso: number;
  }


  export interface Aerogenerador {
    uuid_aerogenerador: string;
    numero_aerogenerador: number;
    uuid_parque_eolico: string;
    modelo_aerogenerador: string;
    fabricante_aerogenerador: string;
    altura_aerogenerador: number;
    diametro_rotor: number;
    potencia_nominal: number;
    coordenada_longitud: number;
    coordenada_latitud: number;
  }

  export interface AerogeneradorConEstado extends Aerogenerador {
    estado_final: number;
  }

export interface ImagenAnomaliaFront {
    uuid_imagen: string;
    ruta_imagen: string;
  }

export interface ImagenAnomaliaPost {
    uuid_imagen: string;
    uuid_anomalia: string;
  }



  export interface ComponenteAerogenerador {
    uuid_componente: string;              // UUID del componente
    uuid_aerogenerador: string;           // UUID del Aerogenerador al que pertenece
    uuid_ultimo_estado?: string | null;   // UUID del último Estado del Aerogenerador (opcional)

    tipo_componente: string;              // Tipo de componente
    coordenada_longitud: number;          // Coordenada de longitud del componente
    coordenada_latitud: number;           // Coordenada de latitud del componente
    ruta_imagen_visualizacion_componente: string; // Ruta de la imagen de visualización del componente
  }



  export interface Imagen {
    uuid_imagen: string;                 // UUID como string
    uuid_aerogenerador: string;          // ForeignKey representado como UUID string
    uuid_componente: string;             // ForeignKey representado como UUID string
    uuid_inspeccion: string;             // ForeignKey representado como UUID string

    nombre_imagen: string;               // Nombre de la imagen
    fecha_creacion: string;              // Fecha en formato ISO, tipado como string
    ruta_imagen: string;                 // Ruta de la imagen

    estado_clasificacion: 'no_clasificada' | 'con_dano' | 'sin_dano'; // Clasificación restringida a los valores posibles
  }



  export interface ValidacionErrores {
    severidadAnomalia?: string;
    dimensionAnomalia?: string;
    orientacionAnomalia?: string;
    descripcionAnomalia?: string;
    ubicacionAnomalia?: string;
    imagenesAnomalia?: string;
  }


  export interface ParqueEolico {
    uuid_parque_eolico: string;
    nombre_parque: string;
    abreviatura_parque: string;
    ubicacion_comuna: string;
    ubicacion_region: string;
    potencia_instalada: number;
    coordenada_longitud: number;
    cantidad_turbinas: number;
    coordenada_latitud: number;
    uuid_empresa: string;

  }

  export interface AnomaliasAerogeneradores{

    helice_a: Anomalia[];          // Lista de anomalías en la Hélice A
    helice_b: Anomalia[];          // Lista de anomalías en la Hélice B
    helice_c: Anomalia[];          // Lista de anomalías en la Hélice C
    torre: Anomalia[];             // Lista de anomalías en la Torre
    nacelle: Anomalia[];           // Lista de anomalías en el Nacelle/Hub

  }

  export interface Empresa {
    uuid_empresa: string;
    nombre_empresa: string;
  }

// Definir las posibles severidades
type Severidad = 'Sin daño' | 'Menor' | 'Significativo' | 'Mayor' | 'Crítico';

// Crear un tipo mapeado para contar las severidades, haciendo que las propiedades sean opcionales con `Partial`
type SeveridadCount = Partial<Record<Severidad, number>>;

// Usar SeveridadCount como antes
export interface CantidadSeveridadesPorComponente {
  [key: string]: SeveridadCount | undefined; // Cada clave representa un componente y tiene un SeveridadCount o es undefined
}
