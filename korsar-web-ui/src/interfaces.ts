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
    orientacion_anomalia: string;    // CharField mapeado a string
    descripcion_anomalia?: string;   // TextField, opcional en TypeScript
    observacion_anomalia?: string;   // TextField, opcional en TypeScript

    coordenada_x: number;            // FloatField mapeado a number
    coordenada_y: number;            // FloatField mapeado a number
  }


  export interface Inspeccion {
    uuid_inspeccion: string;
    uuid_parque_eolico: string;
    nombre_parque: string;
    fecha_inspeccion: string;
    fecha_siguente_inspeccion: string;
    progreso: string;
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
    estado_final: string;
    progreso: string;
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
