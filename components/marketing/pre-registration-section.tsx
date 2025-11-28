"use client";

import { createPreinscripcion } from "@/actions/preinscripciones";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    extractUtmParams,
    preinscripcionSchema,
    type PreinscripcionFormData,
} from "@/lib/validations/preinscripcion";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PreRegistrationSectionProps {
  torneoId: string;
  torneoNombre: string;
  whatsappNumber: string;
}

export function PreRegistrationSection({
  torneoId,
  torneoNombre,
  whatsappNumber,
}: PreRegistrationSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PreinscripcionFormData>({
    resolver: zodResolver(preinscripcionSchema),
    defaultValues: {
      torneo_id: torneoId,
    },
  });

  const onSubmit = async (data: PreinscripcionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Capture UTM params from URL
      const utmParams = extractUtmParams(window.location.href);

      // Capture additional tracking data
      const trackingData = {
        ...data,
        ...utmParams,
        referrer: document.referrer || undefined,
        landing_page_url: window.location.href,
        user_agent: navigator.userAgent,
        // IP will be captured server-side
      };

      // Track form submission start
      if (window.gtag) {
        window.gtag("event", "form_submit_start", {
          event_category: "engagement",
          event_label: "pre_registration",
        });
      }

      // Submit to server
      const result = await createPreinscripcion(trackingData);

      if (result.success) {
        setSubmitSuccess(true);
        reset();

        // Track successful conversion
        if (window.gtag) {
          window.gtag("event", "conversion", {
            event_category: "lead",
            event_label: "pre_registration_success",
          });
        }

        if (window.fbq) {
          window.fbq("track", "Lead", {
            content_name: torneoNombre,
            content_category: "pre_registration",
            value: 1,
            currency: "USD",
          });
        }

        // Scroll to success message
        setTimeout(() => {
          document.getElementById("registration-form")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setSubmitError(result.error);

        // Track error
        if (window.gtag) {
          window.gtag("event", "form_error", {
            event_category: "error",
            event_label: result.error,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Error al enviar el formulario. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp alternative link
  const whatsappMessage = encodeURIComponent(
    `¡Hola! Quiero inscribir mi equipo en ${torneoNombre}. Mi nombre es [TU NOMBRE] y mi teléfono es [TU TELÉFONO].`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="registration-form"
      className="bg-background py-16 px-4 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold sm:text-4xl font-display uppercase">
              {submitSuccess ? "¡Registro Exitoso!" : "Inscribe tu Equipo"}
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              {submitSuccess
                ? "Nos contactaremos contigo pronto"
                : "Completa el formulario y te contactaremos a la brevedad"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            {submitSuccess ? (
              /* Success state */
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold font-display">¡Gracias por tu interés!</h3>
                  <p className="text-muted-foreground">
                    Hemos recibido tu pre-inscripción. Te enviaremos un correo de
                    confirmación y nos contactaremos contigo en las próximas 24 horas.
                  </p>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-left text-sm">
                    <strong>Próximos pasos:</strong>
                    <ol className="mt-2 space-y-1 list-decimal list-inside">
                      <li>Revisa tu correo (incluyendo spam)</li>
                      <li>Prepara la lista de jugadores de tu equipo</li>
                      <li>Espera nuestro contacto vía WhatsApp o email</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => setSubmitSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  Registrar otro equipo
                </Button>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error alert */}
                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* Nombre completo */}
                <div className="space-y-2">
                  <Label htmlFor="nombre_completo" className="text-base font-medium">
                    Nombre completo del director técnico
                  </Label>
                  <Input
                    id="nombre_completo"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    className="h-14 text-base"
                    {...register("nombre_completo")}
                    aria-invalid={errors.nombre_completo ? "true" : "false"}
                    aria-describedby={
                      errors.nombre_completo ? "nombre-error" : undefined
                    }
                  />
                  {errors.nombre_completo && (
                    <p id="nombre-error" className="text-sm text-destructive">
                      {errors.nombre_completo.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="h-14 text-base"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-base font-medium">
                    Teléfono / WhatsApp
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="0999999999"
                    className="h-14 text-base"
                    {...register("telefono")}
                    aria-invalid={errors.telefono ? "true" : "false"}
                    aria-describedby={errors.telefono ? "telefono-error" : undefined}
                  />
                  {errors.telefono && (
                    <p id="telefono-error" className="text-sm text-destructive">
                      {errors.telefono.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Usaremos este número para contactarte vía WhatsApp
                  </p>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-14 w-full text-base font-semibold sm:text-lg font-display tracking-wider uppercase"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Completar Pre-inscripción"
                  )}
                </Button>

                {/* WhatsApp alternative */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O también puedes
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-display tracking-wider uppercase"
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag("event", "whatsapp_click", {
                        event_category: "engagement",
                        event_label: "form_section",
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
                    <MessageCircle className="h-5 w-5" />
                    Inscribirte por WhatsApp
                  </a>
                </Button>

                {/* Privacy notice */}
                <p className="text-center text-xs text-muted-foreground">
                  Al inscribirte, aceptas que GoolStar se ponga en contacto contigo
                  para confirmar los detalles del torneo.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
