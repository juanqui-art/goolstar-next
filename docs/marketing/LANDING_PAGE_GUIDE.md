# 📄 Guía de Landing Page - Pre-inscripciones

**Sistema de captura de leads para campañas de Facebook Ads**

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Configuración Inicial](#configuración-inicial)
4. [Uso de la Landing Page](#uso-de-la-landing-page)
5. [Panel de Administración](#panel-de-administración)
6. [Campañas de Facebook Ads](#campañas-de-facebook-ads)
7. [Métricas y Analytics](#métricas-y-analytics)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

### ¿Qué es?

Sistema completo de pre-inscripción para capturar leads desde campañas de Facebook Ads. Incluye:

- **Landing Page** optimizada para mobile (83% del tráfico)
- **WhatsApp-First** approach (reduce CAC 68% en LatAm)
- **Dual Analytics** (Facebook Pixel + Google Analytics 4)
- **Dashboard Admin** para gestión de leads
- **Email notifications** automáticas

### Flujo del Usuario

```
Facebook Ad → Landing Page → Formulario/WhatsApp → Pre-inscripción
    ↓                             ↓
Admin recibe notificación → Contacta manualmente → Marca estado → Convierte a equipo
```

### Características Clave

✅ WhatsApp como CTA principal (botón verde #25D366)
✅ Formulario simple (3 campos: nombre, email, teléfono)
✅ Tracking UTM completo para medir ROI
✅ Mobile-first (botones 44px+, fonts 16px+)
✅ Zero autenticación requerida para inscribirse

---

## 🏗️ Arquitectura

### Stack Técnico

```
┌─────────────────────────────────────────────┐
│           Facebook Ads Campaign             │
│  (utm_source=facebook, utm_campaign=...)    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Landing Page (Next.js 16)           │
│  - Hero Section (WhatsApp CTA)              │
│  - Features Section                         │
│  - Pre-Registration Form                    │
│  - FAQ Section                              │
│  - Floating WhatsApp Button                 │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│  WhatsApp    │   │   Formulario │
│   Direct     │   │  (3 campos)  │
└──────────────┘   └──────┬───────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Server Action        │
              │  createPreinscripcion │
              └───────┬───────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Supabase │  │  Email   │  │ Webhook  │
│   DB     │  │  (user + │  │ (WhatsApp│
│          │  │  admin)  │  │  admin)  │
└──────────┘  └──────────┘  └──────────┘
      │
      ▼
┌─────────────────────────────────────┐
│     Admin Dashboard                 │
│  - Stats (Total, Pendientes, etc.)  │
│  - Table (filtros, acciones)        │
│  - Export CSV                       │
└─────────────────────────────────────┘
```

### Base de Datos

**Tabla:** `preinscripciones_torneo`

```sql
-- Campos principales
id UUID
torneo_id UUID (nullable para testing)
nombre_completo VARCHAR(100)
email VARCHAR(255)
telefono VARCHAR(20)

-- UTM Tracking
utm_source, utm_medium, utm_campaign, utm_content, utm_term

-- Estado del lead
estado VARCHAR(20) -- pendiente | contactado | confirmado | rechazado | convertido

-- Metadata
referrer, landing_page_url, user_agent, ip_address
created_at, updated_at
```

### Archivos Clave

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

---

## ⚙️ Configuración Inicial

### 1. Aplicar Migración

**Opción A: Desde Supabase Dashboard**
```sql
-- Copiar contenido de:
supabase/migrations/20250125000011_preinscripciones_simple.sql

-- Ejecutar en SQL Editor
https://app.supabase.com/project/[tu-project]/sql
```

**Opción B: Desde CLI (si está configurado)**
```bash
supabase db push
```

### 2. Configurar Variables de Entorno

Edita `.env.local`:

```bash
# ===== ANALYTICS (REQUERIDO) =====
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# ===== NOTIFICACIONES =====
ADMIN_EMAIL=admin@goolstar.com

# ===== WEBHOOK (OPCIONAL) =====
# Para notificaciones a WhatsApp/Telegram vía Zapier/n8n
WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

### 3. Obtener Facebook Pixel ID

1. Ve a https://business.facebook.com/events_manager
2. Selecciona tu Pixel o crea uno nuevo
3. Copia el Pixel ID (15 dígitos)
4. Pega en `NEXT_PUBLIC_FB_PIXEL_ID`

### 4. Obtener Google Analytics 4 ID

1. Ve a https://analytics.google.com/
2. Admin → Data Streams → Web
3. Copia el Measurement ID (formato: G-XXXXXXXXXX)
4. Pega en `NEXT_PUBLIC_GA4_ID`

### 5. Generar Tipos TypeScript

```bash
# Desde Supabase Cloud
supabase gen types typescript --project-id [tu-project-id] > types/database.ts

# O desde Dashboard → Settings → API → TypeScript (copiar y pegar)
```

### 6. Verificar Build

```bash
bun run build
```

---

## 🚀 Uso de la Landing Page

### URL de la Landing Page

```
https://tudominio.com/torneos/[slug]/inscripcion
```

**Ejemplo:**
```
https://goolstar.com/torneos/copa-verano-2025/inscripcion
```

### Personalización del Torneo

Edita `app/(marketing)/torneos/[slug]/inscripcion/page.tsx`:

```typescript
// TODO: Reemplazar con datos reales desde la base de datos
const MOCK_TORNEO = {
  id: "00000000-0000-0000-0000-000000000000",  // UUID real del torneo
  nombre: "Torneo Verano 2025 - Copa GoolStar",
  fecha_inicio: new Date("2025-02-15"),
  whatsapp_number: "593999999999",  // ⚠️ Cambiar por número real
};
```

**Nota:** En el futuro, esto se obtendrá dinámicamente desde la base de datos usando el `slug`.

### WhatsApp Number Format

```typescript
// Ecuador: +593 9X XXX XXXX
whatsapp_number: "593999999999"  // Sin espacios, sin +

// Ejemplo real
whatsapp_number: "593987654321"
```

### Componentes de la Landing

#### 1. Hero Section
- CTA primario: WhatsApp (verde)
- CTA secundario: Scroll al formulario
- Badges: "Cupos Limitados", Fecha de inicio
- Social proof: "+120 equipos inscritos", "$500 en premios"

#### 2. Features Section
- 6 tarjetas con beneficios
- Icons de Lucide React
- Grid responsive (1 col mobile, 2 tablet, 3 desktop)

#### 3. Pre-Registration Form
- 3 campos: Nombre completo, Email, Teléfono
- Validación en tiempo real con Zod
- Captura automática de UTM params
- Botón alternativo de WhatsApp

#### 4. FAQ Section
- 6 preguntas frecuentes
- Accordion UI
- Click para expandir/colapsar

#### 5. Floating WhatsApp Button
- Sticky (siempre visible)
- Botón circular verde (#25D366)
- Animación pulse
- Badge de notificación roja

---

## 👨‍💼 Panel de Administración

### Acceso

```
https://tudominio.com/admin/preinscripciones
```

**Requiere:** Usuario autenticado (cualquier rol por ahora)

### Funcionalidades

#### 1. Stats Cards

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│    Total     │  Pendientes  │ Contactados  │ Convertidos  │
│     120      │      45      │      60      │      15      │
│ Leads total  │ Sin contacto │ En proceso   │ 12.5% conv.  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 2. Tabla de Pre-inscripciones

**Columnas:**
- Nombre completo
- Email + Teléfono (clickeables)
- UTM Source/Campaign
- Estado (dropdown para cambiar)
- Fecha relativa ("hace 2 horas")
- Acciones (WhatsApp link)

**Filtros:**
- Por estado (Todos, Pendientes, Contactados, etc.)
- Export CSV

#### 3. Cambiar Estado de Lead

Estados disponibles:
- **pendiente** (default) - Nuevo lead sin contactar
- **contactado** - Admin ya contactó
- **confirmado** - Equipo confirmó interés
- **rechazado** - No interesado
- **convertido** - Equipo creado en el sistema

**Cómo cambiar:**
1. Click en el dropdown de "Estado"
2. Seleccionar nuevo estado
3. Se guarda automáticamente
4. `fecha_contacto` se actualiza si cambió de "pendiente"

#### 4. Export CSV

Click en "Exportar CSV" para descargar:
```csv
Nombre Completo,Email,Teléfono,Estado,UTM Source,UTM Campaign,Fecha Registro,Notas
Juan Pérez,juan@example.com,0987654321,pendiente,facebook,verano-2025,2025-01-25 10:30,
```

---

## 📢 Campañas de Facebook Ads

### Estructura de URL para Anuncios

```
https://goolstar.com/torneos/copa-verano-2025/inscripcion?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-hero&utm_term=futbol-cuenca
```

### Parámetros UTM Recomendados

| Parámetro | Descripción | Ejemplos |
|-----------|-------------|----------|
| `utm_source` | Plataforma de origen | `facebook`, `instagram`, `google` |
| `utm_medium` | Tipo de tráfico | `cpc`, `social`, `display` |
| `utm_campaign` | Nombre de campaña | `verano-2025`, `copa-enero` |
| `utm_content` | Variante del anuncio | `whatsapp-hero`, `form-cta`, `imagen-1` |
| `utm_term` | Palabra clave | `futbol-cuenca`, `torneo-indoor` |

### Ejemplos de URLs para Diferentes Anuncios

**Anuncio 1: Enfoque WhatsApp**
```
?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-hero&utm_term=futbol-cuenca
```

**Anuncio 2: Enfoque Premios**
```
?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=premios-garantizados&utm_term=torneo-premios
```

**Anuncio 3: Instagram Stories**
```
?utm_source=instagram&utm_medium=stories&utm_campaign=verano-2025&utm_content=story-1&utm_term=futbol-indoor
```

### Configurar en Facebook Ads Manager

1. **Campaign Level:**
   - Objective: Leads
   - Conversion Event: Lead (detectado por Facebook Pixel)

2. **Ad Set Level:**
   - Audience: Ecuador, Cuenca
   - Age: 18-45
   - Interests: Fútbol, Deportes, Torneos

3. **Ad Level:**
   - Destination: Website
   - URL Parameters: Agregar los UTM params

**En el campo "URL Parameters":**
```
utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-hero&utm_term=futbol-cuenca
```

---

## 📊 Métricas y Analytics

### Eventos Trackeados

#### Facebook Pixel

| Evento | Cuándo se dispara |
|--------|-------------------|
| `PageView` | Usuario llega a la landing |
| `Contact` | Click en WhatsApp CTA |
| `InitiateCheckout` | Usuario comienza a llenar form |
| `Lead` | Formulario enviado exitosamente |

#### Google Analytics 4

| Evento | Cuándo se dispara |
|--------|-------------------|
| `page_view` | Usuario llega a la landing |
| `whatsapp_click` | Click en cualquier botón WhatsApp |
| `form_start` | Usuario enfoca primer campo |
| `form_submit_start` | Click en botón submit |
| `conversion` | Formulario enviado exitosamente |
| `scroll` | Usuario scrollea 25%, 50%, 75%, 100% |

### Reportes en Supabase

#### Vista: Conversión por Campaña

```sql
SELECT * FROM vista_conversion_por_campana;
```

**Resultado:**
```
utm_campaign  | utm_source | total_leads | contactados | convertidos | tasa_conversion_pct
verano-2025   | facebook   | 120         | 60          | 15          | 12.50
copa-enero    | instagram  | 45          | 20          | 5           | 11.11
```

#### Vista: Inscripciones Diarias

```sql
SELECT * FROM vista_inscripciones_diarias
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY fecha DESC;
```

**Resultado:**
```
fecha      | total | desde_facebook | via_whatsapp | via_formulario
2025-01-25 | 15    | 12             | 8            | 7
2025-01-24 | 23    | 18             | 15           | 8
```

### KPIs a Monitorear

1. **Tasa de Conversión General:**
   ```
   Convertidos / Total Leads * 100
   ```

2. **Costo por Lead (CPL):**
   ```
   Gasto en Ads / Total Leads
   ```

3. **Costo por Conversión (CPA):**
   ```
   Gasto en Ads / Convertidos
   ```

4. **Ratio WhatsApp vs Formulario:**
   ```
   Leads por WhatsApp / Total Leads
   ```

5. **Tiempo Promedio de Conversión:**
   ```
   Promedio de días desde created_at hasta estado='convertido'
   ```

---

## 🛠️ Troubleshooting

### Problema: No se registra la pre-inscripción

**Síntomas:** Formulario se envía pero no aparece en admin dashboard

**Soluciones:**
1. Verificar que la migración se aplicó:
   ```sql
   SELECT COUNT(*) FROM preinscripciones_torneo;
   ```

2. Verificar RLS policies:
   ```sql
   SELECT * FROM preinscripciones_torneo; -- Como usuario autenticado
   ```

3. Ver logs del Server Action en consola del navegador

4. Verificar que `torneo_id` es válido (o NULL para testing)

### Problema: Facebook Pixel no dispara eventos

**Síntomas:** En Facebook Events Manager no aparecen eventos

**Soluciones:**
1. Verificar que `NEXT_PUBLIC_FB_PIXEL_ID` está configurado

2. Instalar Facebook Pixel Helper extension:
   - Chrome: https://chrome.google.com/webstore → "Facebook Pixel Helper"

3. Verificar en consola del navegador:
   ```javascript
   console.log(window.fbq); // Debe mostrar una función
   ```

4. Test manual:
   ```javascript
   // En consola del navegador
   fbq('track', 'Lead', { test: true });
   ```

### Problema: WhatsApp button no funciona en iOS

**Síntomas:** Click en WhatsApp no abre la app

**Soluciones:**
1. Verificar formato del número (sin espacios, sin +):
   ```typescript
   // ✅ Correcto
   whatsapp_number: "593987654321"

   // ❌ Incorrecto
   whatsapp_number: "+593 98 765 4321"
   ```

2. El formato de URL debe ser:
   ```
   https://wa.me/593987654321?text=...
   ```

3. Probar en Safari (navegador default en iOS)

### Problema: Admin dashboard muestra error de autenticación

**Síntomas:** "No autenticado" al entrar a `/admin/preinscripciones`

**Soluciones:**
1. Verificar que el usuario está logueado:
   ```typescript
   // En Server Component
   const { data: { user } } = await supabase.auth.getUser()
   console.log(user) // Debe existir
   ```

2. Verificar RLS policy permite lectura:
   ```sql
   -- Temporalmente, permite todo a usuarios autenticados
   ALTER POLICY "Authenticated users can view preinscripciones"
   ON preinscripciones_torneo
   TO authenticated
   USING (true);
   ```

3. Si estás en desarrollo, puedes deshabilitar RLS:
   ```sql
   ALTER TABLE preinscripciones_torneo DISABLE ROW LEVEL SECURITY;
   ```

### Problema: Build falla con error de tipos

**Síntomas:** `bun run build` falla con TypeScript errors

**Soluciones:**
1. Regenerar tipos de Supabase:
   ```bash
   supabase gen types typescript --project-id [project-id] > types/database.ts
   ```

2. Verificar imports:
   ```typescript
   import type { Database } from "@/types/database"
   type PreinscripcionRow = Database["public"]["Tables"]["preinscripciones_torneo"]["Row"]
   ```

3. Si falla, comentar temporalmente la referencia a `Database` y usar `any`

---

## 📚 Recursos Adicionales

### Documentación Técnica
- [Facebook Pixel Guide](https://developers.facebook.com/docs/meta-pixel)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js App Router](https://nextjs.org/docs/app)

### Herramientas de Testing
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [UTM Builder](https://ga-dev-tools.web.app/campaign-url-builder/)

### Optimización
- [Mobile-First Design Checklist](https://web.dev/mobile-first/)
- [Core Web Vitals](https://web.dev/vitals/)
- [WhatsApp Business API](https://business.whatsapp.com/)

---

**Última actualización:** 2025-01-25
**Versión:** 1.0
**Autor:** GoolStar Development Team
