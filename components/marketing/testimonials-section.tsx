"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Méndez",
    role: "Capitán - Los Rayos",
    content:
      "La organización es impecable. Los árbitros son profesionales y el ambiente es muy competitivo pero amistoso.",
    avatar: "CM",
    rating: 5,
  },
  {
    name: "Ana Torres",
    role: "Espectadora",
    content:
      "Me encanta ir los fines de semana con mi familia. Las instalaciones son seguras y hay buen ambiente.",
    avatar: "AT",
    rating: 5,
  },
  {
    name: "Juan Pérez",
    role: "Jugador - Halcones",
    content:
      "El mejor torneo de la ciudad sin duda. Los premios se entregan a tiempo y todo es muy transparente.",
    avatar: "JP",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-display uppercase">
            Lo que dicen de nosotros
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[600px] mx-auto">
            La experiencia de jugadores y aficionados es nuestra mejor carta de
            presentación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="border border-border shadow-lg bg-muted/20"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg font-display">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold font-display">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-primary fill-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
