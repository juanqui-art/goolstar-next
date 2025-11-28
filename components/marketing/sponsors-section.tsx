"use client";

import Image from "next/image";

// Placeholder sponsors - in a real app these would be logos
const SPONSORS = [
  { name: "SportFit", logo: "/file.svg" }, // Using existing svg as placeholder
  { name: "EnergyDrink", logo: "/globe.svg" },
  { name: "TechBall", logo: "/window.svg" },
  { name: "LocalGym", logo: "/next.svg" },
  { name: "CityBank", logo: "/vercel.svg" },
];

export function SponsorsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight font-display uppercase">
            Nuestros Patrocinadores
          </h2>
          <p className="text-muted-foreground mt-2">
            Empresas que hacen posible este torneo
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {SPONSORS.map((sponsor, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              {/* Using a div with text fallback since we don't have real logos yet, 
                   but keeping Image structure for when they arrive */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 relative flex items-center justify-center bg-background rounded-full shadow-sm p-3">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-sm">{sponsor.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
