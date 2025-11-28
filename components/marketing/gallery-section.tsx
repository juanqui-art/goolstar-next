"use client";

import Image from "next/image";

const GALLERY_IMAGES = [
  {
    src: "/cancha-goolstar.png",
    alt: "Final del Torneo 2025",
    category: "Finales",
  },
  {
    src: "/cancha.jpg",
    alt: "Fase de Grupos",
    category: "Partidos",
  },
  {
    src: "/cancha-goolstar.png",
    alt: "Premiación",
    category: "Eventos",
  },
  {
    src: "/cancha.jpg",
    alt: "Jugada Destacada",
    category: "Highlights",
  },
  {
    src: "/cancha-goolstar.png",
    alt: "Afición",
    category: "Ambiente",
  },
  {
    src: "/cancha.jpg",
    alt: "Equipo Ganador",
    category: "Equipos",
  },
];

export function GallerySection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-display uppercase">
            Galería del Torneo
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Revive los mejores momentos de nuestros torneos anteriores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-video overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-white font-bold text-lg font-display">{image.alt}</p>
                  <p className="text-white/80 text-sm">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
