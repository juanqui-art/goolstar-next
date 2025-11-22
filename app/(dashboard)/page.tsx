import { Trophy, Users, UserCircle, Calendar, CalendarClock } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts"
import { RecentMatches } from "@/components/dashboard/recent-matches"
import { UpcomingMatches } from "@/components/dashboard/upcoming-matches"
import {
  getDashboardStats,
  getDashboardAlerts,
  getRecentMatches,
  getUpcomingMatches,
} from "@/actions/dashboard"

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel
  const [stats, alerts, recentMatches, upcomingMatches] = await Promise.all([
    getDashboardStats(),
    getDashboardAlerts(),
    getRecentMatches(),
    getUpcomingMatches(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido al Sistema de Gestión de Torneos GoolStar
        </p>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && <DashboardAlerts alerts={alerts} />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Torneos Activos"
          description="Torneos en curso"
          value={stats.torneosActivos}
          icon={<Trophy className="h-4 w-4" />}
        />

        <StatsCard
          title="Equipos"
          description="Equipos registrados"
          value={stats.equiposRegistrados}
          icon={<Users className="h-4 w-4" />}
        />

        <StatsCard
          title="Jugadores"
          description="Jugadores registrados"
          value={stats.jugadoresRegistrados}
          icon={<UserCircle className="h-4 w-4" />}
        />

        <StatsCard
          title="Partidos Hoy"
          description="Programados hoy"
          value={stats.partidosHoy}
          icon={<Calendar className="h-4 w-4" />}
          badge={
            stats.partidosHoy > 0
              ? {
                  text: "Hoy",
                  variant: "info",
                }
              : undefined
          }
        />

        <StatsCard
          title="Próximos 7 Días"
          description="Partidos programados"
          value={stats.partidosProximos}
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      {/* Matches Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingMatches matches={upcomingMatches} />
        <RecentMatches matches={recentMatches} />
      </div>
    </div>
  )
}
