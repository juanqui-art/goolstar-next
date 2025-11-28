import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageCircle, Trophy } from "lucide-react";

interface HeroSectionProps {
  torneoNombre: string;
  torneoFechaInicio?: Date;
  whatsappNumber: string;
  onScrollToForm: () => void;
}

export function HeroSection({
  torneoNombre,
  torneoFechaInicio,
  whatsappNumber,
  onScrollToForm,
}: HeroSectionProps) {
  // Generate WhatsApp link
  const whatsappMessage = encodeURIComponent(
    `¡Hola! Me interesa participar en ${torneoNombre}. ¿Podrían darme más información?`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-in fade-in duration-1000 brightness-120 contrast-120 saturate-105"
          style={{ backgroundImage: "url('/cancha-goolstar.png')" }}
        />
        {/* Brand gradient overlay - Black to Gold tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/75 to-yellow-900/60" />
        {/* Secondary gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {/* Subtle radial gradient for spotlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge: Cupos limitados */}
        <div className="mb-8 flex flex-wrap justify-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/50 backdrop-blur-sm font-display tracking-wide"
          >
            <Trophy className="mr-2 h-4 w-4" />
            2da Edición - Enero 2026
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-sm font-medium text-white border-white/20 backdrop-blur-sm font-display tracking-wide"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Cierre inscripciones: 24 de Enero
          </Badge>
        </div>

        {/* Main headline */}
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200 font-display uppercase">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            {torneoNombre}
          </span>
          <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-medium text-primary">
            Donde nacen las leyendas
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 sm:text-xl md:text-2xl animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 font-sans">
          Más de <span className="text-white font-bold">$3,450 USD</span> en premios. 
          Categorías Varones, Damas y Máster. 
          <br className="hidden sm:block" />
          ¡Tu momento de gloria comienza aquí!
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500">
          {/* Primary CTA: WhatsApp */}
          <Button
            asChild
            size="lg"
            className="h-14 w-full sm:w-auto min-w-[200px] bg-[#25D366] hover:bg-[#20BA5A] text-white text-lg font-semibold shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:-translate-y-1 font-display tracking-wider"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "whatsapp_click", {
                  event_category: "engagement",
                  event_label: "hero_section",
                });
              }
            }}
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-6 w-6" />
              Inscribirse Ahora
            </a>
          </Button>

          {/* Secondary CTA: Scroll to form */}
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full sm:w-auto min-w-[200px] border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 font-display tracking-wider"
            onClick={onScrollToForm}
          >
            Ver Premios
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-gray-400 animate-in fade-in duration-1000 delay-700 font-sans">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Cancha Sintética Profesional
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Arbitraje Certificado
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Ambiente Seguro
          </div>
        </div>
      </div>
    </section>
  );
}
