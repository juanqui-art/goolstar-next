"use client";

import { Calendar, DollarSign, Trophy, Users } from "lucide-react";

const STATS = [
  {
    label: "Equipos",
    value: "32+",
    icon: Users,
    description: "Compitiendo por la gloria",
  },
  {
    label: "Premios",
    value: "$5,000",
    icon: DollarSign,
    description: "En premios a repartir",
  },
  {
    label: "Partidos",
    value: "120+",
    icon: Calendar,
    description: "Llenos de emoción",
  },
  {
    label: "Ediciones",
    value: "5ta",
    icon: Trophy,
    description: "Trayectoria comprobada",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-primary-foreground/10 rounded-full mb-2">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight font-display">
                {stat.value}
              </h3>
              <p className="font-medium text-lg font-display uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm text-primary-foreground/80 hidden md:block">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
