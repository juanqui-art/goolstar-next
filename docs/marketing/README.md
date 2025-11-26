# 📢 Landing Page Marketing - GoolStar

Sistema completo de pre-inscripción para campañas de Facebook Ads.

---

## 🚀 Quick Start (15 minutos)

1. **Aplicar migración:** `supabase/migrations/20250125000011_preinscripciones_simple.sql`
2. **Configurar `.env.local`:**
   ```bash
   NEXT_PUBLIC_FB_PIXEL_ID=tu-pixel-id
   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
   ADMIN_EMAIL=admin@goolstar.com
   ```
3. **Personalizar torneo:** `app/(marketing)/torneos/[slug]/inscripcion/page.tsx`
4. **Test:** `bun run dev` → http://localhost:3000/torneos/copa-verano-2025/inscripcion

**Ver:** [SETUP_COMMANDS.md](./SETUP_COMMANDS.md) para comandos completos.

---

## 📚 Documentación

| Documento | Descripción | Líneas |
|-----------|-------------|--------|
| **[QUICK_START.md](./QUICK_START.md)** | Setup en 15 minutos | 400 |
| **[LANDING_PAGE_GUIDE.md](./LANDING_PAGE_GUIDE.md)** | Guía completa | 1,394 |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Resumen de lo construido | 600 |
| **[SETUP_COMMANDS.md](./SETUP_COMMANDS.md)** | Comandos para copiar/pegar | 300 |

---

## ✅ ¿Qué incluye?

- ✅ Landing page mobile-first
- ✅ Formulario con validación (3 campos)
- ✅ WhatsApp-First approach (CTA verde)
- ✅ Facebook Pixel + Google Analytics 4
- ✅ Admin dashboard (stats + tabla)
- ✅ UTM tracking completo
- ✅ Export CSV
- ✅ Email notifications (hooks)

---

## 📂 Estructura de Archivos

```
Backend:
├── supabase/migrations/20250125000011_preinscripciones_simple.sql
├── lib/validations/preinscripcion.ts
└── actions/preinscripciones.ts

Landing Page:
├── app/(marketing)/torneos/[slug]/inscripcion/page.tsx
├── components/marketing/hero-section.tsx
├── components/marketing/features-section.tsx
├── components/marketing/pre-registration-section.tsx
├── components/marketing/faq-section.tsx
└── components/marketing/whatsapp-floating-button.tsx

Analytics:
├── components/analytics/facebook-pixel.tsx
├── components/analytics/google-analytics.tsx
└── lib/analytics/track-events.ts

Admin:
├── app/(dashboard)/admin/preinscripciones/page.tsx
├── components/admin/preinscripciones-stats.tsx
└── components/admin/preinscripciones-table.tsx
```

**Total:** 27 archivos creados

---

## 🎯 URLs

### Desarrollo
```
Landing:  http://localhost:3000/torneos/copa-verano-2025/inscripcion
Admin:    http://localhost:3000/admin/preinscripciones
```

### Producción
```
Landing:  https://goolstar.com/torneos/copa-verano-2025/inscripcion
Admin:    https://goolstar.com/admin/preinscripciones
```

### Facebook Ads (con UTM)
```
https://goolstar.com/torneos/copa-verano-2025/inscripcion?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-hero&utm_term=futbol-cuenca
```

---

## 📊 Analytics & Tracking

### Eventos Trackeados

**Facebook Pixel:**
- PageView (landing load)
- Contact (WhatsApp click)
- Lead (form submit)

**Google Analytics 4:**
- page_view
- whatsapp_click
- form_start
- conversion
- scroll (25%, 50%, 75%, 100%)

### Métricas en Admin Dashboard

- Total inscripciones
- Pendientes / Contactados / Convertidos
- Tasa de conversión
- Export CSV

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Forms:** React Hook Form + Zod
- **Analytics:** Facebook Pixel + Google Analytics 4
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Date:** date-fns

---

## 🎓 Recursos

- [Facebook Pixel Setup](https://developers.facebook.com/docs/meta-pixel)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [UTM Builder](https://ga-dev-tools.web.app/campaign-url-builder/)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🚨 Soporte

**Problemas comunes:** Ver [LANDING_PAGE_GUIDE.md § Troubleshooting](./LANDING_PAGE_GUIDE.md#troubleshooting)

**Setup paso a paso:** Ver [QUICK_START.md](./QUICK_START.md)

**Comandos:** Ver [SETUP_COMMANDS.md](./SETUP_COMMANDS.md)

---

**Status:** ✅ Completo - Listo para Deploy

**Última actualización:** 2025-01-25
