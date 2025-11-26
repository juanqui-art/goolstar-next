import { MessageCircle, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary/90 py-16 px-4 sm:py-24 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Badge: Cupos limitados */}
          <div className="mb-6 flex justify-center gap-2">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium shadow-lg"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Cupos Limitados
            </Badge>
            {torneoFechaInicio && (
              <Badge
                variant="outline"
                className="bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Inicia:{" "}
                {torneoFechaInicio.toLocaleDateString("es-EC", {
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            )}
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {torneoNombre}
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl">
            Inscribe a tu equipo en el mejor torneo de fútbol indoor de Cuenca.{" "}
            <span className="font-semibold">¡Premios garantizados!</span>
          </p>

          {/* Social proof */}
          <div className="mb-10 flex flex-wrap justify-center gap-6 text-sm text-white/80 sm:text-base">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white" />
                <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white" />
                <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white" />
              </div>
              <span>+120 equipos inscritos</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span>$500 en premios</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {/* Primary CTA: WhatsApp */}
            <Button
              asChild
              size="lg"
              className="h-14 w-full bg-[#25D366] px-8 text-base font-semibold text-white hover:bg-[#20BA5A] active:bg-[#1DA851] sm:w-auto sm:min-w-[240px] md:h-16 md:text-lg"
              onClick={() => {
                // Track WhatsApp click
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "whatsapp_click", {
                    event_category: "engagement",
                    event_label: "hero_section",
                  });
                }
                if (typeof window !== "undefined" && window.fbq) {
                  window.fbq("track", "Contact", { content_name: "whatsapp_hero" });
                }
              }}
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                Inscríbete por WhatsApp
              </a>
            </Button>

            {/* Secondary CTA: Scroll to form */}
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full border-2 border-white bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 active:bg-white/30 sm:w-auto sm:min-w-[240px] md:h-16 md:text-lg"
              onClick={() => {
                onScrollToForm();
                // Track form CTA click
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "form_cta_click", {
                    event_category: "engagement",
                    event_label: "hero_section",
                  });
                }
              }}
            >
              Ver más información
            </Button>
          </div>

          {/* Trust badge */}
          <p className="mt-8 text-sm text-white/70">
            ✓ Inscripción segura · ✓ Canchas profesionales · ✓ Arbitraje certificado
          </p>
        </div>
      </div>
    </section>
  );
}
