/**
 * Analytics event tracking helpers
 * Centralizes tracking logic for Google Analytics 4 and Facebook Pixel
 */

// =====================================================
// 1. WhatsApp CTA tracking
// =====================================================

export function trackWhatsAppClick(location: "hero" | "form" | "sticky" | "footer") {
  // Google Analytics 4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "whatsapp_click", {
      event_category: "engagement",
      event_label: location,
      value: 1,
    });
  }

  // Facebook Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact", {
      content_name: `whatsapp_${location}`,
      content_category: "whatsapp_cta",
    });
  }
}

// =====================================================
// 2. Form interaction tracking
// =====================================================

export function trackFormStart() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_start", {
      event_category: "engagement",
      event_label: "pre_registration_form",
    });
  }

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_name: "pre_registration",
    });
  }
}

export function trackFormSubmitSuccess(torneoNombre: string) {
  // Google Analytics 4 - Conversion
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      event_category: "lead",
      event_label: "pre_registration_success",
      value: 1,
    });

    // Track as goal completion
    window.gtag("event", "generate_lead", {
      currency: "USD",
      value: 1,
    });
  }

  // Facebook Pixel - Lead event
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: torneoNombre,
      content_category: "pre_registration",
      value: 1,
      currency: "USD",
    });
  }
}

export function trackFormError(errorMessage: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_error", {
      event_category: "error",
      event_label: errorMessage,
    });
  }
}

// =====================================================
// 3. Scroll depth tracking
// =====================================================

export function trackScrollDepth(percentage: 25 | 50 | 75 | 100) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "scroll", {
      event_category: "engagement",
      event_label: `scroll_${percentage}`,
      value: percentage,
    });
  }
}

// =====================================================
// 4. CTA button clicks
// =====================================================

export function trackCTAClick(
  ctaName: string,
  location: "hero" | "features" | "form" | "faq",
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      event_category: "engagement",
      event_label: `${ctaName}_${location}`,
    });
  }

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", "CTAClick", {
      cta_name: ctaName,
      cta_location: location,
    });
  }
}

// =====================================================
// 5. Outbound link tracking
// =====================================================

export function trackOutboundLink(url: string, linkText: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "click", {
      event_category: "outbound",
      event_label: url,
      transport_type: "beacon",
      value: linkText,
    });
  }
}

// =====================================================
// 6. Video engagement (if videos are added later)
// =====================================================

export function trackVideoPlay(videoName: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "video_start", {
      event_category: "engagement",
      event_label: videoName,
    });
  }

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", "VideoView", {
      video_name: videoName,
    });
  }
}

// =====================================================
// 7. FAQ interaction tracking
// =====================================================

export function trackFAQClick(question: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "faq_click", {
      event_category: "engagement",
      event_label: question,
    });
  }
}

// =====================================================
// 8. UTM parameter tracking (on page load)
// =====================================================

export function trackUTMParameters() {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
  };

  // Only track if at least one UTM param exists
  const hasUTM = Object.values(utmParams).some((val) => val !== null);

  if (hasUTM && window.gtag) {
    window.gtag("event", "utm_tracking", {
      event_category: "acquisition",
      ...utmParams,
    });
  }
}

// =====================================================
// 9. Scroll depth observer (auto-track)
// =====================================================

let scrollDepthTracked: Set<number> = new Set();

export function initScrollDepthTracking() {
  if (typeof window === "undefined") return;

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    // Track at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    for (const milestone of milestones) {
      if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
        trackScrollDepth(milestone as 25 | 50 | 75 | 100);
        scrollDepthTracked.add(milestone);
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup
  return () => {
    window.removeEventListener("scroll", handleScroll);
    scrollDepthTracked = new Set();
  };
}

// =====================================================
// 10. Type definitions for window extensions
// =====================================================

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}
