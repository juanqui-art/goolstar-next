import { Card, CardContent } from "@/components/ui/card";
import {
    BarChart3,
    Calendar,
    DollarSign,
    Flag,
    Trophy,
    Users,
} from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Premios Garantizados",
    description:
      "Más de $3,450 en premios repartidos. Campeón, subcampeón, tercero y cuarto lugar reciben reconocimiento.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "group-hover:border-yellow-500/50",
  },
  {
    icon: BarChart3,
    title: "Estadísticas en Vivo",
    description:
      "Seguimiento profesional: goles, tarjetas, tabla de posiciones y rendimiento de jugadores en tiempo real.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/50",
  },
  {
    icon: Calendar,
    title: "Fixture Organizado",
    description:
      "Calendario digital actualizado. Consulta horarios, canchas y resultados desde cualquier dispositivo.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "group-hover:border-green-500/50",
  },
  {
    icon: Users,
    title: "Gestión de Equipos",
    description:
      "Plataforma digital para administrar tu plantilla, subir fotos y gestionar documentos de jugadores.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/50",
  },
  {
    icon: Flag,
    title: "Arbitraje Profesional",
    description:
      "Jueces certificados y evaluados constantemente para garantizar imparcialidad y juego limpio.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "group-hover:border-red-500/50",
  },
  {
    icon: DollarSign,
    title: "Inscripción Flexible",
    description:
      "Opciones de pago adaptadas a tu equipo. Facilidades para asegurar tu participación.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "group-hover:border-emerald-500/50",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center animate-in slide-in-from-bottom-8 fade-in duration-700">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-display uppercase">
            ¿Por qué elegir GoolStar?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Elevamos el nivel del fútbol amateur con tecnología y organización profesional
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-${feature.color.split('-')[1]}-500/5`} />
                
                <CardContent className="p-8 relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold sm:text-2xl group-hover:text-primary transition-colors duration-300 font-display">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
