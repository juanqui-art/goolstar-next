"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to fetch all jugadores
 * TODO: Replace with TanStack Query for better caching
 */
export function useJugadores() {
  const [jugadores, setJugadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchJugadores() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getJugadores()
        // setJugadores(data)
        setJugadores([]); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchJugadores();
  }, []);

  return { jugadores, loading, error };
}

/**
 * Custom hook to fetch a single jugador by ID with stats
 * TODO: Replace with TanStack Query for better caching
 */
export function useJugador(id: string) {
  const [jugador, setJugador] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchJugador() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getJugador(id)
        // setJugador(data)
        setJugador(null); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchJugador();
    }
  }, [id]);

  return { jugador, loading, error };
}

/**
 * Custom hook to filter jugadores by equipo
 */
export function useJugadoresByEquipo(equipoId: string) {
  const { jugadores, loading, error } = useJugadores();

  const filteredJugadores = jugadores.filter(
    (jugador) => jugador.equipo_id === equipoId,
  );

  return { jugadores: filteredJugadores, loading, error };
}

/**
 * Custom hook to filter suspended jugadores
 */
export function useJugadoresSuspendidos() {
  const { jugadores, loading, error } = useJugadores();

  const suspended = jugadores.filter(
    (jugador) => jugador.suspension_partidos > 0,
  );

  return { jugadores: suspended, loading, error };
}
