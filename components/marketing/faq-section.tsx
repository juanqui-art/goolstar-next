"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "¿Cuánto cuesta participar en el torneo?",
    answer:
      "El costo de inscripción varía según la categoría. Contacta con nosotros vía WhatsApp o completa el formulario para recibir información detallada sobre precios y opciones de pago fraccionado.",
  },
  {
    question: "¿Cuántos jugadores necesito para inscribir mi equipo?",
    answer:
      "Recomendamos un mínimo de 10 jugadores y un máximo de 16 por equipo. Esto permite tener suplentes y garantizar que tu equipo pueda competir en todos los partidos sin problemas.",
  },
  {
    question: "¿Cómo funciona el proceso de inscripción?",
    answer:
      "1) Completa el formulario de pre-inscripción o escríbenos por WhatsApp. 2) Nuestro equipo te contactará en 24 horas para confirmar detalles. 3) Recibirás instrucciones para completar el pago y registrar a tus jugadores. 4) ¡Listo! Tu equipo estará inscrito oficialmente.",
  },
  {
    question: "¿Cuándo comienza el torneo?",
    answer:
      "Las fechas exactas dependen de la cantidad de equipos inscritos. Generalmente iniciamos 2-3 semanas después del cierre de inscripciones. Te notificaremos el fixture completo con anticipación.",
  },
  {
    question: "¿Qué incluye la inscripción?",
    answer:
      "Tu inscripción incluye: acceso al sistema de gestión GoolStar para ver estadísticas y fixture, arbitraje profesional en todos los partidos, seguro deportivo básico, premios para campeón, subcampeón y goleador, y acceso a canchas sintéticas de primera calidad.",
  },
  {
    question: "¿Cómo se realizan los pagos?",
    answer:
      "Aceptamos pagos en efectivo, transferencia bancaria y tarjeta de crédito. Ofrecemos opciones de pago fraccionado para mayor comodidad. Los detalles específicos te serán enviados al confirmar tu pre-inscripción.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-muted/30 py-16 px-4 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-display uppercase">
            Preguntas Frecuentes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Resolvemos tus dudas más comunes
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className={cn(
                "cursor-pointer border-2 transition-all duration-200",
                openIndex === index
                  ? "shadow-md border-primary"
                  : "hover:border-muted-foreground/20",
              )}
              onClick={() => toggleFAQ(index)}
            >
              <CardContent className="p-0">
                {/* Question */}
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-6 text-left sm:p-8"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-semibold sm:text-xl pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                      openIndex === index && "rotate-180",
                    )}
                  />
                </button>

                {/* Answer */}
                <div
                  id={`faq-answer-${index}`}
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="text-lg text-muted-foreground">
            ¿Tienes más preguntas?{" "}
            <a
              href="#registration-form"
              className="font-semibold text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("registration-form")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Contáctanos aquí
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
