"use client"

import { useState, useEffect } from "react"
import { getPartidos, getPartido } from "@/actions/partidos"

/**
 * Custom hook to fetch all partidos
 * TODO: Replace with TanStack Query for better caching
 */
export function usePartidos() {
  const [partidos, setPartidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPartidos() {
      try {
        setLoading(true)
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getPartidos()
        // setPartidos(data)
        setPartidos([]) // Placeholder
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartidos()
  }, [])

  return { partidos, loading, error }
}

/**
 * Custom hook to fetch a single partido by ID with details
 * TODO: Replace with TanStack Query for better caching
 */
export function usePartido(id: string) {
  const [partido, setPartido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPartido() {
      try {
        setLoading(true)
        // TODO: Uncomment when Server Actions are implemented
        // const data = await getPartido(id)
        // setPartido(data)
        setPartido(null) // Placeholder
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPartido()
    }
  }, [id])

  return { partido, loading, error }
}

/**
 * Custom hook to filter partidos by torneo
 */
export function usePartidosByTorneo(torneoId: string) {
  const { partidos, loading, error } = usePartidos()

  const filteredPartidos = partidos.filter(
    (partido) => partido.torneo_id === torneoId
  )

  return { partidos: filteredPartidos, loading, error }
}

/**
 * Custom hook to filter partidos by equipo
 */
export function usePartidosByEquipo(equipoId: string) {
  const { partidos, loading, error } = usePartidos()

  const filteredPartidos = partidos.filter(
    (partido) =>
      partido.equipo_1_id === equipoId || partido.equipo_2_id === equipoId
  )

  return { partidos: filteredPartidos, loading, error }
}

/**
 * Custom hook to get upcoming partidos (next 7 days)
 */
export function useUpcomingPartidos() {
  const { partidos, loading, error } = usePartidos()

  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcoming = partidos
    .filter((partido) => {
      const fecha = new Date(partido.fecha)
      return fecha >= now && fecha <= nextWeek
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  return { partidos: upcoming, loading, error }
}
