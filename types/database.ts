/**
 * Auto-generated Supabase types from database schema
 * Generated from: supabase/migrations/ (001-010)
 * Database: PostgreSQL 15
 *
 * To regenerate after schema changes:
 * supabase gen types typescript --project-id omvpzlbbfwkyqwbwqnjf > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      arbitros: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          cedula: string;
          email: string | null;
          telefono: string | null;
          nivel: number;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          apellido: string;
          cedula: string;
          email?: string | null;
          telefono?: string | null;
          nivel?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido?: string;
          cedula?: string;
          email?: string | null;
          telefono?: string | null;
          nivel?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cambios_jugador: {
        Row: {
          id: string;
          partido_id: string;
          jugador_sale_id: string;
          jugador_entra_id: string;
          equipo_id: string;
          minuto: number;
          razon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          jugador_sale_id: string;
          jugador_entra_id: string;
          equipo_id: string;
          minuto: number;
          razon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          jugador_sale_id?: string;
          jugador_entra_id?: string;
          equipo_id?: string;
          minuto?: number;
          razon?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cambios_jugador_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cambios_jugador_jugador_entra_id_fkey";
            columns: ["jugador_entra_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cambios_jugador_jugador_sale_id_fkey";
            columns: ["jugador_sale_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cambios_jugador_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
        ];
      };
      categorias: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          costo_inscripcion: number;
          multa_amarilla: number;
          multa_roja: number;
          limite_amarillas: number;
          suspension_roja_partidos: number;
          limite_inasistencias: number;
          pago_arbitro: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          costo_inscripcion?: number;
          multa_amarilla?: number;
          multa_roja?: number;
          limite_amarillas?: number;
          suspension_roja_partidos?: number;
          limite_inasistencias?: number;
          pago_arbitro?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          costo_inscripcion?: number;
          multa_amarilla?: number;
          multa_roja?: number;
          limite_amarillas?: number;
          suspension_roja_partidos?: number;
          limite_inasistencias?: number;
          pago_arbitro?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dirigentes: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          email: string;
          telefono: string | null;
          cedula: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          apellido: string;
          email: string;
          telefono?: string | null;
          cedula?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido?: string;
          email?: string;
          telefono?: string | null;
          cedula?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      equipos: {
        Row: {
          id: string;
          nombre: string;
          torneo_id: string;
          categoria_id: string;
          dirigente_id: string | null;
          color_principal: string | null;
          color_secundario: string | null;
          escudo_url: string | null;
          nivel: Database["public"]["Enums"]["nivel_enum"];
          grupo: string | null;
          numero_equipo: number | null;
          activo: boolean;
          retirado: boolean;
          suspendido: boolean;
          inasistencias: number;
          excluido_por_inasistencias: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          torneo_id: string;
          categoria_id: string;
          dirigente_id?: string | null;
          color_principal?: string | null;
          color_secundario?: string | null;
          escudo_url?: string | null;
          nivel?: Database["public"]["Enums"]["nivel_enum"];
          grupo?: string | null;
          numero_equipo?: number | null;
          activo?: boolean;
          retirado?: boolean;
          suspendido?: boolean;
          inasistencias?: number;
          excluido_por_inasistencias?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          torneo_id?: string;
          categoria_id?: string;
          dirigente_id?: string | null;
          color_principal?: string | null;
          color_secundario?: string | null;
          escudo_url?: string | null;
          nivel?: Database["public"]["Enums"]["nivel_enum"];
          grupo?: string | null;
          numero_equipo?: number | null;
          activo?: boolean;
          retirado?: boolean;
          suspendido?: boolean;
          inasistencias?: number;
          excluido_por_inasistencias?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "equipos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "equipos_dirigente_id_fkey";
            columns: ["dirigente_id"];
            isOneToOne: false;
            referencedRelation: "dirigentes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "equipos_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      estadistica_equipo: {
        Row: {
          id: string;
          torneo_id: string;
          equipo_id: string;
          partidos_jugados: number;
          partidos_ganados: number;
          partidos_empatados: number;
          partidos_perdidos: number;
          goles_favor: number;
          goles_contra: number;
          diferencia_goles: number;
          puntos: number;
          amarillas_totales: number;
          rojas_totales: number;
          amarillas_pagadas: number;
          rojas_pagadas: number;
          ultima_actualizacion: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          equipo_id: string;
          partidos_jugados?: number;
          partidos_ganados?: number;
          partidos_empatados?: number;
          partidos_perdidos?: number;
          goles_favor?: number;
          goles_contra?: number;
          diferencia_goles?: number;
          puntos?: number;
          amarillas_totales?: number;
          rojas_totales?: number;
          amarillas_pagadas?: number;
          rojas_pagadas?: number;
          ultima_actualizacion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          equipo_id?: string;
          partidos_jugados?: number;
          partidos_ganados?: number;
          partidos_empatados?: number;
          partidos_perdidos?: number;
          goles_favor?: number;
          goles_contra?: number;
          diferencia_goles?: number;
          puntos?: number;
          amarillas_totales?: number;
          rojas_totales?: number;
          amarillas_pagadas?: number;
          rojas_pagadas?: number;
          ultima_actualizacion?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "estadistica_equipo_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "estadistica_equipo_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      eventos_partido: {
        Row: {
          id: string;
          partido_id: string;
          tipo: string;
          descripcion: string | null;
          minuto: number | null;
          equipo_afectada_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          tipo: string;
          descripcion?: string | null;
          minuto?: number | null;
          equipo_afectada_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          tipo?: string;
          descripcion?: string | null;
          minuto?: number | null;
          equipo_afectada_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "eventos_partido_equipo_afectada_id_fkey";
            columns: ["equipo_afectada_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "eventos_partido_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
        ];
      };
      eventos_torneo: {
        Row: {
          id: string;
          torneo_id: string;
          tipo: string;
          descripcion: string | null;
          fecha: string | null;
          creado_por_admin: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          tipo: string;
          descripcion?: string | null;
          fecha?: string | null;
          creado_por_admin?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          tipo?: string;
          descripcion?: string | null;
          fecha?: string | null;
          creado_por_admin?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "eventos_torneo_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      fases_eliminatorias: {
        Row: {
          id: string;
          torneo_id: string;
          nombre: string;
          numero_equipos: number;
          numero_ganadores: number;
          orden: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          nombre: string;
          numero_equipos: number;
          numero_ganadores: number;
          orden: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          nombre?: string;
          numero_equipos?: number;
          numero_ganadores?: number;
          orden?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fases_eliminatorias_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      goles: {
        Row: {
          id: string;
          partido_id: string;
          jugador_id: string | null;
          equipo_id: string;
          minuto: number;
          es_propio: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          jugador_id?: string | null;
          equipo_id: string;
          minuto: number;
          es_propio?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          jugador_id?: string | null;
          equipo_id?: string;
          minuto?: number;
          es_propio?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goles_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goles_jugador_id_fkey";
            columns: ["jugador_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goles_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
        ];
      };
      jornadas: {
        Row: {
          id: string;
          torneo_id: string;
          numero: number;
          fecha_prevista: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          numero: number;
          fecha_prevista?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          numero?: number;
          fecha_prevista?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "jornadas_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      jugador_documentos: {
        Row: {
          id: string;
          jugador_id: string;
          tipo: Database["public"]["Enums"]["tipo_documento"];
          url: string;
          estado: Database["public"]["Enums"]["estado_documento"];
          comentario_rechazo: string | null;
          verificado_por_admin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          jugador_id: string;
          tipo: Database["public"]["Enums"]["tipo_documento"];
          url: string;
          estado?: Database["public"]["Enums"]["estado_documento"];
          comentario_rechazo?: string | null;
          verificado_por_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          jugador_id?: string;
          tipo?: Database["public"]["Enums"]["tipo_documento"];
          url?: string;
          estado?: Database["public"]["Enums"]["estado_documento"];
          comentario_rechazo?: string | null;
          verificado_por_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "jugador_documentos_jugador_id_fkey";
            columns: ["jugador_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
        ];
      };
      jugadores: {
        Row: {
          id: string;
          equipo_id: string;
          primer_nombre: string;
          segundo_nombre: string | null;
          primer_apellido: string;
          segundo_apellido: string | null;
          cedula: string | null;
          numero_dorsal: number | null;
          posicion: string | null;
          nivel: Database["public"]["Enums"]["nivel_enum"];
          activo: boolean;
          suspendido: boolean;
          partidos_suspension_restantes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipo_id: string;
          primer_nombre: string;
          segundo_nombre?: string | null;
          primer_apellido: string;
          segundo_apellido?: string | null;
          cedula?: string | null;
          numero_dorsal?: number | null;
          posicion?: string | null;
          nivel?: Database["public"]["Enums"]["nivel_enum"];
          activo?: boolean;
          suspendido?: boolean;
          partidos_suspension_restantes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipo_id?: string;
          primer_nombre?: string;
          segundo_nombre?: string | null;
          primer_apellido?: string;
          segundo_apellido?: string | null;
          cedula?: string | null;
          numero_dorsal?: number | null;
          posicion?: string | null;
          nivel?: Database["public"]["Enums"]["nivel_enum"];
          activo?: boolean;
          suspendido?: boolean;
          partidos_suspension_restantes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "jugadores_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
        ];
      };
      llaves_eliminatorias: {
        Row: {
          id: string;
          fase_id: string;
          numero_llave: number;
          equipo_1_id: string | null;
          equipo_2_id: string | null;
          resultado_equipo_ganador: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fase_id: string;
          numero_llave: number;
          equipo_1_id?: string | null;
          equipo_2_id?: string | null;
          resultado_equipo_ganador?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fase_id?: string;
          numero_llave?: number;
          equipo_1_id?: string | null;
          equipo_2_id?: string | null;
          resultado_equipo_ganador?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "llaves_eliminatorias_equipo_1_id_fkey";
            columns: ["equipo_1_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "llaves_eliminatorias_equipo_2_id_fkey";
            columns: ["equipo_2_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "llaves_eliminatorias_fase_id_fkey";
            columns: ["fase_id"];
            isOneToOne: false;
            referencedRelation: "fases_eliminatorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "llaves_eliminatorias_resultado_equipo_ganador_fkey";
            columns: ["resultado_equipo_ganador"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
        ];
      };
      mejores_perdedores: {
        Row: {
          id: string;
          torneo_id: string;
          equipo_id: string;
          grupo: string;
          posicion: number;
          puntos: number;
          diferencia_goles: number;
          goles_a_favor: number;
          ranking_general: number | null;
          avanza: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          equipo_id: string;
          grupo: string;
          posicion: number;
          puntos: number;
          diferencia_goles: number;
          goles_a_favor: number;
          ranking_general?: number | null;
          avanza?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          equipo_id?: string;
          grupo?: string;
          posicion?: number;
          puntos?: number;
          diferencia_goles?: number;
          goles_a_favor?: number;
          ranking_general?: number | null;
          avanza?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mejores_perdedores_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mejores_perdedores_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      pagos_arbitro: {
        Row: {
          id: string;
          arbitro_id: string;
          torneo_id: string;
          partido_id: string | null;
          monto: number;
          pagado: boolean;
          fecha_pago: string | null;
          metodo_pago: string | null;
          referencia_externa: string | null;
          usuario_admin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          arbitro_id: string;
          torneo_id: string;
          partido_id?: string | null;
          monto: number;
          pagado?: boolean;
          fecha_pago?: string | null;
          metodo_pago?: string | null;
          referencia_externa?: string | null;
          usuario_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          arbitro_id?: string;
          torneo_id?: string;
          partido_id?: string | null;
          monto?: number;
          pagado?: boolean;
          fecha_pago?: string | null;
          metodo_pago?: string | null;
          referencia_externa?: string | null;
          usuario_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pagos_arbitro_arbitro_id_fkey";
            columns: ["arbitro_id"];
            isOneToOne: false;
            referencedRelation: "arbitros";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_arbitro_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_arbitro_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      participacion_jugador: {
        Row: {
          id: string;
          partido_id: string;
          jugador_id: string;
          equipo_id: string;
          es_titular: boolean;
          minutos_jugados: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          jugador_id: string;
          equipo_id: string;
          es_titular?: boolean;
          minutos_jugados?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          jugador_id?: string;
          equipo_id?: string;
          es_titular?: boolean;
          minutos_jugados?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "participacion_jugador_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "participacion_jugador_jugador_id_fkey";
            columns: ["jugador_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "participacion_jugador_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
        ];
      };
      partidos: {
        Row: {
          id: string;
          torneo_id: string;
          equipo_1_id: string;
          equipo_2_id: string;
          jornada_id: string | null;
          fase_eliminatoria_id: string | null;
          arbitro_id: string | null;
          fecha: string | null;
          cancha: string | null;
          goles_equipo_1: number;
          goles_equipo_2: number;
          completado: boolean;
          resultado_retiro: string | null;
          resultado_inasistencia: string | null;
          sancion: string | null;
          penales_equipo_1: number | null;
          penales_equipo_2: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          equipo_1_id: string;
          equipo_2_id: string;
          jornada_id?: string | null;
          fase_eliminatoria_id?: string | null;
          arbitro_id?: string | null;
          fecha?: string | null;
          cancha?: string | null;
          goles_equipo_1?: number;
          goles_equipo_2?: number;
          completado?: boolean;
          resultado_retiro?: string | null;
          resultado_inasistencia?: string | null;
          sancion?: string | null;
          penales_equipo_1?: number | null;
          penales_equipo_2?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          equipo_1_id?: string;
          equipo_2_id?: string;
          jornada_id?: string | null;
          fase_eliminatoria_id?: string | null;
          arbitro_id?: string | null;
          fecha?: string | null;
          cancha?: string | null;
          goles_equipo_1?: number;
          goles_equipo_2?: number;
          completado?: boolean;
          resultado_retiro?: string | null;
          resultado_inasistencia?: string | null;
          sancion?: string | null;
          penales_equipo_1?: number | null;
          penales_equipo_2?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partidos_arbitro_id_fkey";
            columns: ["arbitro_id"];
            isOneToOne: false;
            referencedRelation: "arbitros";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partidos_equipo_1_id_fkey";
            columns: ["equipo_1_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partidos_equipo_2_id_fkey";
            columns: ["equipo_2_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partidos_fase_eliminatoria_id_fkey";
            columns: ["fase_eliminatoria_id"];
            isOneToOne: false;
            referencedRelation: "fases_eliminatorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partidos_jornada_id_fkey";
            columns: ["jornada_id"];
            isOneToOne: false;
            referencedRelation: "jornadas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partidos_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      tarjetas: {
        Row: {
          id: string;
          partido_id: string;
          jugador_id: string;
          equipo_id: string;
          tipo: Database["public"]["Enums"]["tipo_tarjeta"];
          minuto: number;
          razon: string | null;
          pagada: boolean;
          monto_multa: number | null;
          suspension_cumplida: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          jugador_id: string;
          equipo_id: string;
          tipo: Database["public"]["Enums"]["tipo_tarjeta"];
          minuto: number;
          razon?: string | null;
          pagada?: boolean;
          monto_multa?: number | null;
          suspension_cumplida?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          jugador_id?: string;
          equipo_id?: string;
          tipo?: Database["public"]["Enums"]["tipo_tarjeta"];
          minuto?: number;
          razon?: string | null;
          pagada?: boolean;
          monto_multa?: number | null;
          suspension_cumplida?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tarjetas_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tarjetas_jugador_id_fkey";
            columns: ["jugador_id"];
            isOneToOne: false;
            referencedRelation: "jugadores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tarjetas_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
        ];
      };
      torneos: {
        Row: {
          id: string;
          nombre: string;
          categoria_id: string;
          fecha_inicio: string;
          fecha_fin: string | null;
          fase_actual: Database["public"]["Enums"]["fase_torneo"];
          tiene_fase_grupos: boolean;
          tiene_eliminacion_directa: boolean;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          categoria_id: string;
          fecha_inicio: string;
          fecha_fin?: string | null;
          fase_actual?: Database["public"]["Enums"]["fase_torneo"];
          tiene_fase_grupos?: boolean;
          tiene_eliminacion_directa?: boolean;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          categoria_id?: string;
          fecha_inicio?: string;
          fecha_fin?: string | null;
          fase_actual?: Database["public"]["Enums"]["fase_torneo"];
          tiene_fase_grupos?: boolean;
          tiene_eliminacion_directa?: boolean;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "torneos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
        ];
      };
      transacciones_pago: {
        Row: {
          id: string;
          equipo_id: string;
          torneo_id: string;
          tipo: Database["public"]["Enums"]["tipo_transaccion"];
          monto: number;
          es_ingreso: boolean;
          descripcion: string | null;
          razon: string | null;
          partido_id: string | null;
          tarjeta_id: string | null;
          jugador_id: string | null;
          metodo_pago: string | null;
          referencia_externa: string | null;
          pagado: boolean;
          fecha_pago: string | null;
          usuario_admin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipo_id: string;
          torneo_id: string;
          tipo: Database["public"]["Enums"]["tipo_transaccion"];
          monto: number;
          es_ingreso?: boolean;
          descripcion?: string | null;
          razon?: string | null;
          partido_id?: string | null;
          tarjeta_id?: string | null;
          jugador_id?: string | null;
          metodo_pago?: string | null;
          referencia_externa?: string | null;
          pagado?: boolean;
          fecha_pago?: string | null;
          usuario_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipo_id?: string;
          torneo_id?: string;
          tipo?: Database["public"]["Enums"]["tipo_transaccion"];
          monto?: number;
          es_ingreso?: boolean;
          descripcion?: string | null;
          razon?: string | null;
          partido_id?: string | null;
          tarjeta_id?: string | null;
          jugador_id?: string | null;
          metodo_pago?: string | null;
          referencia_externa?: string | null;
          pagado?: boolean;
          fecha_pago?: string | null;
          usuario_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transacciones_pago_equipo_id_fkey";
            columns: ["equipo_id"];
            isOneToOne: false;
            referencedRelation: "equipos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transacciones_pago_partido_id_fkey";
            columns: ["partido_id"];
            isOneToOne: false;
            referencedRelation: "partidos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transacciones_pago_tarjeta_id_fkey";
            columns: ["tarjeta_id"];
            isOneToOne: false;
            referencedRelation: "tarjetas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transacciones_pago_torneo_id_fkey";
            columns: ["torneo_id"];
            isOneToOne: false;
            referencedRelation: "torneos";
            referencedColumns: ["id"];
          },
        ];
      };
      preinscripciones_torneo: {
        Row: {
          id: string;
          torneo_id: string | null;
          nombre_completo: string;
          email: string;
          telefono: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_term: string | null;
          referrer: string | null;
          landing_page_url: string | null;
          estado: string;
          fecha_contacto: string | null;
          notas_seguimiento: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          torneo_id?: string | null;
          nombre_completo: string;
          email: string;
          telefono: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          referrer?: string | null;
          landing_page_url?: string | null;
          estado?: string;
          fecha_contacto?: string | null;
          notas_seguimiento?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string | null;
          nombre_completo?: string;
          email?: string;
          telefono?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          referrer?: string | null;
          landing_page_url?: string | null;
          estado?: string;
          fecha_contacto?: string | null;
          notas_seguimiento?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      actualizar_estadisticas_partido: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      calcular_deuda_equipo: {
        Args: {
          p_equipo_id: string;
        };
        Returns: number;
      };
      existe_preinscripcion: {
        Args: {
          p_torneo_id: string;
          p_email: string;
          p_telefono: string;
        };
        Returns: boolean;
      };
      crear_estadistica_equipo: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_jugadores_destacados: {
        Args: {
          p_torneo_id: string;
          p_limit?: number;
        };
        Returns: Array<{
          jugador_id: string;
          jugador_nombre: string;
          equipo_nombre: string;
          total_goles: number;
        }>;
      };
      get_jugadores_suspendidos: {
        Args: {
          p_equipo_id: string;
        };
        Returns: Array<{
          jugador_id: string;
          nombre_completo: string;
          suspendido: boolean;
          partidos_restantes: number;
          razon: string | null;
        }>;
      };
      get_resumen_tarjetas_equipo: {
        Args: {
          p_equipo_id: string;
          p_torneo_id?: string;
        };
        Returns: Array<{
          equipo_id: string;
          equipo_nombre: string;
          amarillas_totales: number;
          amarillas_pagadas: number;
          amarillas_pendientes: number;
          rojas_totales: number;
          rojas_pagadas: number;
          rojas_pendientes: number;
          multa_total: number;
          multa_pagada: number;
          multa_pendiente: number;
        }>;
      };
      get_tabla_posiciones: {
        Args: {
          p_torneo_id: string;
        };
        Returns: Array<{
          equipo_id: string;
          equipo_nombre: string;
          logo_url: string | null;
          grupo: string | null;
          partidos_jugados: number;
          partidos_ganados: number;
          partidos_empatados: number;
          partidos_perdidos: number;
          goles_favor: number;
          goles_contra: number;
          diferencia_goles: number;
          puntos: number;
        }>;
      };
      registrar_inasistencia: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      suspender_por_tarjeta_roja: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      verificar_amarillas_acumuladas: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      estado_documento: "pendiente" | "verificado" | "rechazado" | "resubir";
      fase_torneo:
        | "inscripcion"
        | "grupos"
        | "octavos"
        | "cuartos"
        | "semifinales"
        | "final"
        | "finalizado";
      nivel_enum: "1" | "2" | "3" | "4" | "5";
      tipo_documento:
        | "dni_frontal"
        | "dni_posterior"
        | "cedula_frontal"
        | "cedula_posterior"
        | "pasaporte"
        | "otro";
      tipo_tarjeta: "AMARILLA" | "ROJA";
      tipo_transaccion:
        | "abono_inscripcion"
        | "pago_arbitro"
        | "pago_balon"
        | "multa_amarilla"
        | "multa_roja"
        | "ajuste_manual"
        | "devolucion";
    };
    CompositeTypes: {};
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] & {
      Row: Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Row: infer R;
      }
        ? R
        : never;
      Insert: Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I;
      }
        ? I
        : never;
      Update: Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U;
      }
        ? U
        : never;
    }
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & {})
    ? PublicSchema["Tables"][PublicTableNameOrOptions] & {
        Row: PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Row: infer R;
        }
          ? R
          : never;
        Insert: PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I;
        }
          ? I
          : never;
        Update: PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U;
        }
          ? U
          : never;
      }
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & {})
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & {})
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (PublicSchema["Enums"] & {})
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"] & {})
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof (PublicSchema["Enums"] & {})
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
