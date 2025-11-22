"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to fetch all torneos
 * TODO: Replace with TanStack Query for better caching
 */
export function useTorneos() {
  const [torneos, setTorneos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTorneos() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getTorneos()
        // setTorneos(data)
        setTorneos([]); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchTorneos();
  }, []);

  return { torneos, loading, error };
}

/**
 * Custom hook to fetch a single torneo by ID
 * TODO: Replace with TanStack Query for better caching
 */
export function useTorneo(id: string) {
  const [torneo, setTorneo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTorneo() {
      try {
        setLoading(true);
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getTorneo(id)
        // setTorneo(data)
        setTorneo(null); // Placeholder
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTorneo();
    }
  }, [id]);

  return { torneo, loading, error };
}
