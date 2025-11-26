# 🚀 Quick Start - Landing Page Pre-inscripciones

**Pon en marcha el sistema en 15 minutos**

---

## ✅ Checklist de Setup

### 1️⃣ Base de Datos (5 min)

- [ ] Abrir Supabase Dashboard
- [ ] Ir a SQL Editor
- [ ] Copiar contenido de `supabase/migrations/20250125000011_preinscripciones_simple.sql`
- [ ] Ejecutar (Run)
- [ ] Verificar que tabla `preinscripciones_torneo` existe en Table Editor

### 2️⃣ Configurar Analytics (5 min)

**Facebook Pixel:**
- [ ] Ir a https://business.facebook.com/events_manager
- [ ] Copiar Pixel ID
- [ ] Agregar a `.env.local`: `NEXT_PUBLIC_FB_PIXEL_ID=TU_PIXEL_ID`

**Google Analytics:**
- [ ] Ir a https://analytics.google.com/
- [ ] Crear propiedad GA4
- [ ] Copiar Measurement ID (G-XXXXXXXXXX)
- [ ] Agregar a `.env.local`: `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`

### 3️⃣ Configurar WhatsApp Number (2 min)

- [ ] Editar `app/(marketing)/torneos/[slug]/inscripcion/page.tsx`
- [ ] Buscar: `whatsapp_number: "593999999999"`
- [ ] Reemplazar con tu número real (formato: 593XXXXXXXXX)

### 4️⃣ Personalizar Torneo (2 min)

En el mismo archivo, actualizar:
```typescript
const MOCK_TORNEO = {
  id: "00000000-0000-0000-0000-000000000000", // Dejar así por ahora
  nombre: "Tu Torneo Aquí - Copa 2025",        // ⬅️ CAMBIAR
  fecha_inicio: new Date("2025-02-15"),        // ⬅️ CAMBIAR
  whatsapp_number: "593XXXXXXXXX",             // ⬅️ CAMBIAR
};
```

### 5️⃣ Verificar Build (1 min)

```bash
bun run build
```

- [ ] Build exitoso sin errores
- [ ] 0 TypeScript errors

---

## 🎯 URLs Importantes

### Desarrollo Local

```bash
# Iniciar servidor
bun run dev

# Landing page
http://localhost:3000/torneos/copa-verano-2025/inscripcion

# Admin dashboard
http://localhost:3000/admin/preinscripciones
```

### Producción (Vercel)

```
# Landing page
https://tudominio.com/torneos/copa-verano-2025/inscripcion

# Admin dashboard
https://tudominio.com/admin/preinscripciones
```

---

## 📝 Crear Primera Campaña de Facebook Ads

### Paso 1: URL Base

```
https://goolstar.com/torneos/copa-verano-2025/inscripcion
```

### Paso 2: Agregar UTM Parameters

```
?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-cta&utm_term=futbol-cuenca
```

### Paso 3: URL Completa

```
https://goolstar.com/torneos/copa-verano-2025/inscripcion?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025&utm_content=whatsapp-cta&utm_term=futbol-cuenca
```

### Paso 4: Configurar en Facebook Ads Manager

1. **Campaign:**
   - Objective: Leads
   - Name: Verano 2025 - Copa GoolStar

2. **Ad Set:**
   - Location: Ecuador → Cuenca
   - Age: 18-45
   - Interests: Fútbol, Deportes

3. **Ad:**
   - Format: Single Image/Video
   - Primary Text: "🏆 Inscribe tu equipo en el Torneo Verano 2025..."
   - Headline: "Cupos Limitados - Premios Garantizados"
   - Description: "WhatsApp directo para más info"
   - **Website URL:** (la URL completa del Paso 3)
   - Call to Action: "Inscribirse ahora"

---

## 🧪 Testing Checklist

### Test en Local (antes de deploy)

- [ ] Landing page carga sin errores
- [ ] Hero section muestra correctamente
- [ ] WhatsApp buttons funcionan (abren WhatsApp)
- [ ] Formulario permite ingresar datos
- [ ] Formulario valida campos (probar con email inválido)
- [ ] Formulario se envía correctamente
- [ ] Mensaje de éxito aparece tras envío
- [ ] Floating WhatsApp button es visible
- [ ] FAQ accordion abre/cierra

### Test de Analytics

**Facebook Pixel:**
- [ ] Instalar Facebook Pixel Helper extension
- [ ] Abrir landing page
- [ ] Verificar que Pixel Helper muestra "PageView"
- [ ] Click en WhatsApp → Verificar evento "Contact"
- [ ] Enviar formulario → Verificar evento "Lead"

**Google Analytics:**
- [ ] Abrir Google Analytics Real-Time view
- [ ] Abrir landing page
- [ ] Verificar que apareces en "Realtime" → "Users"
- [ ] Click en WhatsApp → Verificar evento "whatsapp_click"

### Test del Admin Dashboard

- [ ] Login como usuario autenticado
- [ ] Ir a `/admin/preinscripciones`
- [ ] Verificar que stats cards muestran números
- [ ] Verificar que tabla muestra las pre-inscripciones
- [ ] Cambiar estado de un lead (dropdown)
- [ ] Click en email → Abre cliente de correo
- [ ] Click en teléfono → Abre WhatsApp
- [ ] Exportar CSV → Descarga archivo

---

## 🎨 Personalización Visual (Opcional)

### Cambiar Colores

Editar `hero-section.tsx`:
```typescript
// Color del gradiente del hero
className="bg-gradient-to-br from-primary/95 via-primary to-primary/90"

// Cambiar por:
className="bg-gradient-to-br from-blue-600/95 via-blue-700 to-blue-800/90"
```

### Cambiar Textos

**Hero headline:**
```typescript
<h1 className="...">
  {torneoNombre} {/* Se toma de MOCK_TORNEO */}
</h1>
```

**Hero subheadline:**
```typescript
<p className="...">
  Inscribe a tu equipo en el mejor torneo de fútbol indoor de Cuenca.
  <span className="font-semibold">¡Premios garantizados!</span>
</p>
```

### Agregar Logo

```typescript
// En hero-section.tsx, antes del h1:
<Image
  src="/logo-torneo.png"
  alt="Logo Torneo"
  width={120}
  height={120}
  className="mb-6"
/>
```

---

## 📊 Ver Resultados

### En Supabase Dashboard

```sql
-- Ver todas las inscripciones
SELECT
  nombre_completo,
  email,
  telefono,
  estado,
  utm_source,
  created_at
FROM preinscripciones_torneo
ORDER BY created_at DESC;

-- Ver conversión por campaña
SELECT * FROM vista_conversion_por_campana;

-- Ver inscripciones de hoy
SELECT COUNT(*)
FROM preinscripciones_torneo
WHERE created_at::date = CURRENT_DATE;
```

### En Facebook Events Manager

1. Ir a https://business.facebook.com/events_manager
2. Seleccionar tu Pixel
3. Ver eventos en tiempo real: "Test Events"
4. Ver métricas: "Overview" → últimos 28 días

### En Google Analytics 4

1. Ir a https://analytics.google.com/
2. Reports → Realtime (para ver tráfico actual)
3. Reports → Engagement → Events (para ver todos los eventos)
4. Explore → Free Form (para crear reportes custom)

---

## 🔧 Variables de Entorno Completas

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Analytics
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Notificaciones
ADMIN_EMAIL=admin@goolstar.com

# Webhook (opcional)
# WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

---

## 🚨 Problemas Comunes

### "Cannot find module '@/components/ui/button'"

**Solución:**
```bash
# Instalar shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add skeleton
```

### "Module not found: Can't resolve 'date-fns'"

**Solución:**
```bash
bun add date-fns
```

### "Module not found: Can't resolve '@hookform/resolvers'"

**Solución:**
```bash
bun add react-hook-form @hookform/resolvers zod
```

### WhatsApp no abre en mobile

**Verificar:**
1. Número tiene formato correcto: `593XXXXXXXXX`
2. No tiene espacios ni símbolos (+, -, etc.)
3. URL es: `https://wa.me/593XXXXXXXXX?text=...`

---

## 📞 Soporte

**Documentación Completa:** `docs/marketing/LANDING_PAGE_GUIDE.md`

**Archivos Clave:**
- Landing Page: `app/(marketing)/torneos/[slug]/inscripcion/page.tsx`
- Admin: `app/(dashboard)/admin/preinscripciones/page.tsx`
- Server Actions: `actions/preinscripciones.ts`
- Migración: `supabase/migrations/20250125000011_preinscripciones_simple.sql`

---

**¡Listo para capturar leads!** 🎯

Una vez completado este checklist, tu landing page estará lista para recibir tráfico de Facebook Ads y convertir leads en equipos inscritos.
