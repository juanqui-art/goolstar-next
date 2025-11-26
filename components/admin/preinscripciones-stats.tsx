import { Users, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPreinscripcionesStats } from "@/actions/preinscripciones";

interface PreinscripcionesStatsProps {
  torneoId?: string;
}

export async function PreinscripcionesStats({ torneoId }: PreinscripcionesStatsProps) {
  const result = await getPreinscripcionesStats(torneoId);

  if (!result.success) {
    return (
      <div className="text-center text-destructive">
        Error al cargar estadísticas: {result.error}
      </div>
    );
  }

  const stats = result.data;

  const statCards = [
    {
      title: "Total Inscripciones",
      value: stats.total,
      icon: Users,
      description: "Leads capturados",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: Clock,
      description: "Sin contactar",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Contactados",
      value: stats.contactados + stats.confirmados,
      icon: CheckCircle2,
      description: "En proceso",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Convertidos",
      value: stats.convertidos,
      icon: TrendingUp,
      description: `${stats.tasaConversion}% conversión`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
