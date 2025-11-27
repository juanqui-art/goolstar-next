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
      "Campeón, subcampeón y goleador reciben premios en efectivo. ¡Tu esfuerzo será recompensado!",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Estadísticas en Vivo",
    description:
      "Accede a estadísticas completas de tu equipo: goles, tarjetas, posiciones y más.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Fixture Organizado",
    description:
      "Consulta el calendario completo, resultados y próximos partidos desde tu celular.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Gestión de Equipos",
    description:
      "Administra tu plantilla, convoca jugadores y mantén todo organizado en un solo lugar.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Flag,
    title: "Arbitraje Profesional",
    description:
      "Árbitros capacitados y certificados garantizan partidos justos y transparentes.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: DollarSign,
    title: "Precio Accesible",
    description:
      "Cuotas flexibles y pagos fraccionados. Invierte en tu pasión sin complicaciones.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-16 px-4 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            ¿Por qué elegir GoolStar?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Más que un torneo: una experiencia completa para tu equipo
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 transition-all hover:shadow-lg hover:-translate-y-1 duration-200"
              >
                <CardContent className="p-6 sm:p-8">
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor}`}
                  >
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="text-lg font-medium text-muted-foreground">
            ¿Listo para vivir la mejor experiencia futbolística?
          </p>
        </div>
      </div>
    </section>
  );
}
