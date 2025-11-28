# Análisis de Secciones de Landing Page vs. Estrategia de Investigación

Este documento analiza la estructura actual de la Landing Page (`app/(marketing)/page.tsx`) y propone modificaciones basadas en la investigación de "Optimización Estratégica" para maximizar la conversión en cada fase del torneo.

## Estado Actual
La página cuenta con:
1.  **HeroSection**: Título, subtítulo, botones de CTA (WhatsApp y Scroll).
2.  **FeaturesSection**: Grid de 6 beneficios estáticos.
3.  **PreRegistrationSection**: Formulario completo de preinscripción.
4.  **FAQSection**: Acordeón de preguntas frecuentes.

## Análisis por Fases (Según Investigación)

### Fase 1: Expectativa (Semanas -4 a -2)
*   **Objetivo**: Capturar leads interesados ("Notificarme").
*   **Brecha Actual**: El `PreRegistrationSection` pide demasiados datos para esta fase.
*   **Recomendación**:
    *   Simplificar el formulario a solo "Email/WhatsApp" y "Nombre".
    *   Cambiar CTA del Hero a "Únete a la lista de espera".

### Fase 2: Lanzamiento "Early Bird" (Semanas -2 a -1) - **FOCO ACTUAL**
*   **Objetivo**: Inscripción rápida con incentivo económico.
*   **Brecha Actual**:
    *   **Falta Sección de Precios**: La investigación menciona "Precios Escalonados" y descuentos, pero no hay una sección visual que muestre el valor vs. precio.
    *   **Formulario**: El formulario actual muestra un mensaje de éxito en sitio. La investigación sugiere **redirección inmediata a WhatsApp** para cerrar el pago.
*   **Recomendación**:
    *   **[NUEVO] PricingSection**: Mostrar claramente el precio "Early Bird" vs Precio Normal.
    *   **Modificar PreRegistrationSection**: Implementar la lógica de "Submit -> Redirect to WhatsApp" descrita en la investigación.

### Fase 3: Cierre (Semana 0)
*   **Objetivo**: FOMO (Miedo a perderse algo).
*   **Brecha Actual**: No hay elementos de urgencia dinámica.
*   **Recomendación**:
    *   **Hero**: Añadir contador regresivo o indicador de "Cupos Restantes" real.

## Propuesta de Estructura (Fase 2 - Lanzamiento)

Orden sugerido de secciones para la versión de lanzamiento:

1.  **HeroSection**
    *   *Ajuste*: Badge destacando "Inscripciones Abiertas" y "Descuento Early Bird".
2.  **FeaturesSection** (Social Proof)
    *   *Mantener*: Refuerza el valor del torneo.
3.  **[NUEVO] PricingSection**
    *   *Propósito*: Mostrar las categorías y el costo de inscripción con el descuento aplicado.
    *   *Elementos*: Tarjetas de precios (Ej: "Categoría Libre", "Veteranos") con lista de qué incluye.
4.  **PreRegistrationSection** (Conversión)
    *   *Ajuste*: Formulario optimizado con Zod + Server Actions.
    *   *Flujo*: Al enviar -> Redirección a WhatsApp con mensaje de pago.
5.  **FAQSection** (Manejo de Objeciones)
    *   *Mantener*: Resolver dudas sobre pagos y fechas.

## Acciones Inmediatas
1.  Diseñar y crear `PricingSection`.
2.  Refactorizar `PreRegistrationSection` para usar Server Actions y redirección.
3.  Actualizar `HeroSection` con copy de "Lanzamiento".
