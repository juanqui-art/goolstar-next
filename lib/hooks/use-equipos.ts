"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to fetch all equipos
 * TODO: Replace with TanStack Query for better caching
 */
export function useEquipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEquipos() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getEquipos()
        // setEquipos(data)
        setEquipos([]); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchEquipos();
  }, []);

  return { equipos, loading, error };
}

/**
 * Custom hook to fetch a single equipo by ID with stats
 * TODO: Replace with TanStack Query for better caching
 */
export function useEquipo(id: string) {
  const [equipo, setEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEquipo() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getEquipo(id)
        // setEquipo(data)
        setEquipo(null); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEquipo();
    }
  }, [id]);

  return { equipo, loading, error };
}

/**
 * Custom hook to filter equipos by torneo
 */
export function useEquiposByTorneo(torneoId: string) {
  const { equipos, loading, error } = useEquipos();

  const filteredEquipos = equipos.filter(
    (equipo) => equipo.torneo_id === torneoId,
  );

  return { equipos: filteredEquipos, loading, error };
}
