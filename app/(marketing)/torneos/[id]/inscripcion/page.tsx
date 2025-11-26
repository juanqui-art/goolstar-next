"use client";

import { use, useEffect } from "react";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { PreRegistrationSection } from "@/components/marketing/pre-registration-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { WhatsAppFloatingButton } from "@/components/marketing/whatsapp-floating-button";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { initScrollDepthTracking, trackUTMParameters } from "@/lib/analytics/track-events";

interface PageProps {
  params: Promise<{ id: string }>;
}

// TODO: Replace with real data from database
const MOCK_TORNEO = {
  id: "00000000-0000-0000-0000-000000000000",
  nombre: "Torneo Verano 2025 - Copa GoolStar",
  fecha_inicio: new Date("2025-02-15"),
  whatsapp_number: "593999999999", // Replace with real WhatsApp number
};

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export default function LandingPage({ params }: PageProps) {
  const { id } = use(params);

  useEffect(() => {
    // Initialize scroll depth tracking
    const cleanup = initScrollDepthTracking();

    // Track UTM parameters on mount
    trackUTMParameters();

    return cleanup;
  }, []);

  const scrollToForm = () => {
    document.getElementById("registration-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* Analytics */}
      {FB_PIXEL_ID && <FacebookPixel pixelId={FB_PIXEL_ID} />}
      {GA4_ID && <GoogleAnalytics gaId={GA4_ID} />}

      {/* Main content */}
      <main className="min-h-screen">
        <HeroSection
          torneoNombre={MOCK_TORNEO.nombre}
          torneoFechaInicio={MOCK_TORNEO.fecha_inicio}
          whatsappNumber={MOCK_TORNEO.whatsapp_number}
          onScrollToForm={scrollToForm}
        />

        <FeaturesSection />

        <PreRegistrationSection
          torneoId={MOCK_TORNEO.id}
          torneoNombre={MOCK_TORNEO.nombre}
          whatsappNumber={MOCK_TORNEO.whatsapp_number}
        />

        <FAQSection />

        {/* Floating WhatsApp button */}
        <WhatsAppFloatingButton
          whatsappNumber={MOCK_TORNEO.whatsapp_number}
          message={`¡Hola! Me interesa participar en ${MOCK_TORNEO.nombre}. ¿Podrían darme más información?`}
        />
      </main>

      {/* Footer (optional) */}
      <footer className="bg-muted py-8 px-4">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>© 2025 GoolStar. Todos los derechos reservados.</p>
          <p className="mt-2">
            Plataforma de gestión de torneos de fútbol indoor en Cuenca, Ecuador.
          </p>
        </div>
      </footer>
    </>
  );
}
