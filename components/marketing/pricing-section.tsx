import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Trophy, Users } from "lucide-react";

const categories = [
  {
    id: "damas",
    name: "Categoría Damas",
    description: "Nivel Medio",
    price: 70,
    features: [
      "1er Lugar: $600 + Trofeo + Medallas",
      "2do Lugar: $250 + Trofeo + Medallas",
      "3er Lugar: $100 + Trofeo + Medallas",
      "4to Lugar: $50 + Trofeo",
    ],
    icon: Users,
    color: "text-pink-500",
    borderColor: "border-pink-500/20",
    bgColor: "bg-pink-500/5",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
  },
  {
    id: "varones",
    name: "Categoría Varones",
    description: "Sin mundialitos",
    price: 100,
    popular: true,
    features: [
      "1er Lugar: $1,200 + Trofeo + Medallas",
      "2do Lugar: $500 + Trofeo + Medallas",
      "3er Lugar: $150 + Trofeo + Medallas",
      "4to Lugar: $50 + Trofeo",
    ],
    icon: Trophy,
    color: "text-primary",
    borderColor: "border-primary/50",
    bgColor: "bg-primary/5",
    buttonColor: "bg-primary hover:bg-primary/90",
  },
  {
    id: "master",
    name: "Categoría Máster",
    description: "1 refuerzo no mundialito",
    price: 70,
    features: [
      "1er Lugar: $500 + Trofeo + Medallas",
      "2do Lugar: $350 + Trofeo + Medallas",
      "3er Lugar: $100 + Trofeo + Medallas",
      "4to Lugar: $50 + Trofeo",
    ],
    icon: Star,
    color: "text-orange-500",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 font-display uppercase">
            Premios y Categorías
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Más de <span className="font-bold text-primary">$3,450 USD</span> en premios repartidos entre las mejores escuadras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${category.borderColor} ${category.bgColor} ${category.popular ? 'shadow-lg scale-105 md:scale-110 z-10' : ''}`}
              >
                {category.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg font-display tracking-wider">
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${category.bgColor} border ${category.borderColor}`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold font-display uppercase">{category.name}</CardTitle>
                  <CardDescription className="text-base mt-2 font-sans">{category.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold font-display">${category.price}</span>
                    <span className="text-muted-foreground font-sans">/equipo</span>
                  </div>

                  <ul className="space-y-4">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-sans">
                        <Check className={`w-5 h-5 flex-shrink-0 ${category.color}`} />
                        <span className="text-muted-foreground text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8">
                  <Button 
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 ${category.buttonColor} text-white shadow-md hover:shadow-lg font-display tracking-wider uppercase`}
                    onClick={() => {
                      document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Inscribir Equipo
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
