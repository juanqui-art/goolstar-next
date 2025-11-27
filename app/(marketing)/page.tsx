"use client";

import { FAQSection } from "@/components/marketing/faq-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { PreRegistrationSection } from "@/components/marketing/pre-registration-section";
import { WhatsAppFloatingButton } from "@/components/marketing/whatsapp-floating-button";
import { useCallback } from "react";

// CONSTANTS - TODO: Replace with actual data from CMS or config
const TORNEO_DATA = {
  id: "00000000-0000-0000-0000-000000000000", // Placeholder UUID - Replace with real Tournament ID
  nombre: "Torneo GoolStar 2025",
  fechaInicio: new Date("2025-03-15"), // Example date
  whatsapp: "593999999999", // Example number - Replace with real WhatsApp number
};

export default function LandingPage() {
  const scrollToForm = useCallback(() => {
    const formElement = document.getElementById("registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection
        torneoNombre={TORNEO_DATA.nombre}
        torneoFechaInicio={TORNEO_DATA.fechaInicio}
        whatsappNumber={TORNEO_DATA.whatsapp}
        onScrollToForm={scrollToForm}
      />

      <FeaturesSection />

      <PreRegistrationSection
        torneoId={TORNEO_DATA.id}
        torneoNombre={TORNEO_DATA.nombre}
        whatsappNumber={TORNEO_DATA.whatsapp}
      />

      <FAQSection />

      <WhatsAppFloatingButton whatsappNumber={TORNEO_DATA.whatsapp} />
    </main>
  );
}
