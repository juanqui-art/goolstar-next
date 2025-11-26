"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsAppFloatingButtonProps {
  whatsappNumber: string;
  message?: string;
  className?: string;
}

export function WhatsAppFloatingButton({
  whatsappNumber,
  message = "¡Hola! Me interesa participar en el torneo de GoolStar. ¿Podrían darme más información?",
  className,
}: WhatsAppFloatingButtonProps) {
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        // Position
        "fixed bottom-6 right-6 z-50",
        // Size - 44px minimum for mobile tap targets
        "h-14 w-14 sm:h-16 sm:w-16",
        // Styling
        "rounded-full shadow-2xl",
        "bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851]",
        "border-4 border-white",
        // Animation
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "animate-pulse hover:animate-none",
        className,
      )}
      onClick={() => {
        // Track WhatsApp click
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "whatsapp_click", {
            event_category: "engagement",
            event_label: "floating_button",
          });
        }
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Contact", { content_name: "whatsapp_floating" });
        }
      }}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />

        {/* Notification badge (optional) */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500" />
      </a>
    </Button>
  );
}
