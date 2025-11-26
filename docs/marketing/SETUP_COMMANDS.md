# ⚡ Comandos de Setup - Landing Page

**Copia y pega estos comandos para setup rápido**

---

## 1️⃣ Aplicar Migración en Supabase

### Opción A: SQL Dashboard (Recomendado)

```bash
# 1. Copia el contenido del archivo:
cat supabase/migrations/20250125000011_preinscripciones_simple.sql

# 2. Ve a:
# https://app.supabase.com/project/[tu-project]/sql

# 3. Pega el SQL y ejecuta
```

### Opción B: CLI (si está configurado)

```bash
supabase db push
```

---

## 2️⃣ Configurar Variables de Entorno

```bash
# Editar .env.local
code .env.local  # O tu editor preferido

# Agregar estas variables:
```

```bash
# Facebook Pixel (REQUERIDO)
NEXT_PUBLIC_FB_PIXEL_ID=TU_PIXEL_ID_AQUI

# Google Analytics 4 (REQUERIDO)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Admin Email (REQUERIDO)
ADMIN_EMAIL=admin@goolstar.com

# Webhook (OPCIONAL - para notificaciones WhatsApp)
# WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
```

---

## 3️⃣ Personalizar Torneo

```bash
# Editar página principal
code app/(marketing)/torneos/[id]/inscripcion/page.tsx
```

**Buscar y cambiar:**

```typescript
const MOCK_TORNEO = {
  id: "00000000-0000-0000-0000-000000000000",
  nombre: "TU TORNEO AQUI",              // ⬅️ CAMBIAR
  fecha_inicio: new Date("2025-02-15"),  // ⬅️ CAMBIAR
  whatsapp_number: "593XXXXXXXXX",       // ⬅️ CAMBIAR (tu número)
};
```

---

## 4️⃣ Test Local

```bash
# Instalar dependencias (si no lo has hecho)
bun install

# Iniciar dev server
bun run dev

# Abrir en navegador:
# http://localhost:3000/torneos/copa-verano-2025/inscripcion
```

---

## 5️⃣ Verificar Build

```bash
# Build de producción
bun run build

# Si hay errores, verificar tipos:
# bun run lint
```

---

## 6️⃣ Deploy a Vercel (Producción)

```bash
# Si usas Vercel CLI
vercel deploy --prod

# O via Git (auto-deploy)
git add .
git commit -m "feat: add landing page pre-registration system"
git push origin main
```

---

## 🧪 Testing Completo

### Test Frontend

```bash
# 1. Abrir landing page
open http://localhost:3000/torneos/copa-verano-2025/inscripcion

# 2. Probar WhatsApp buttons (deben abrir WhatsApp)

# 3. Probar formulario:
#    - Ingresar datos válidos
#    - Probar validación (email inválido, etc.)
#    - Enviar formulario
#    - Verificar mensaje de éxito
```

### Test Admin Dashboard

```bash
# 1. Login como usuario autenticado

# 2. Ir a admin dashboard
open http://localhost:3000/admin/preinscripciones

# 3. Verificar:
#    - Stats cards muestran números
#    - Tabla muestra inscripciones
#    - Filtros funcionan
#    - Cambiar estado funciona
#    - Export CSV descarga
```

### Test Analytics

**Facebook Pixel:**
```bash
# 1. Instalar Facebook Pixel Helper
# Chrome: https://chrome.google.com/webstore → "Facebook Pixel Helper"

# 2. Abrir landing page
# 3. Verificar icono del Pixel Helper (debe estar verde)
# 4. Click en WhatsApp → Ver evento "Contact"
# 5. Enviar form → Ver evento "Lead"
```

**Google Analytics:**
```bash
# 1. Ir a Google Analytics
open https://analytics.google.com/

# 2. Reports → Realtime
# 3. Abrir landing page en otro tab
# 4. Verificar que apareces en "Realtime Users"
```

---

## 📊 Queries de Verificación

### Ver Pre-inscripciones en Supabase

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
ORDER BY created_at DESC
LIMIT 10;
```

### Ver Stats

```sql
-- Contar por estado
SELECT
  estado,
  COUNT(*) as total
FROM preinscripciones_torneo
GROUP BY estado;
```

### Ver Conversión por Campaña

```sql
-- Vista pre-creada
SELECT * FROM vista_conversion_por_campana;
```

---

## 🚨 Si Algo Falla

### "Error: Table does not exist"

```bash
# Verificar que migración se aplicó
supabase db push

# O aplicar manualmente en SQL Editor
```

### "Error: Module not found date-fns"

```bash
# Instalar dependencia
bun add date-fns
```

### "Facebook Pixel no funciona"

```bash
# Verificar variable de entorno
echo $NEXT_PUBLIC_FB_PIXEL_ID

# Debe mostrar tu Pixel ID (15 dígitos)
# Si no, editar .env.local
```

### "WhatsApp no abre"

**Verificar formato del número:**
```typescript
// ✅ Correcto
whatsapp_number: "593987654321"

// ❌ Incorrecto
whatsapp_number: "+593 98 765 4321"
whatsapp_number: "0987654321"
```

---

## 🎬 Comandos Quick Start (Copiar Todo)

```bash
# ===== SETUP COMPLETO =====

# 1. Instalar dependencias
bun install

# 2. Copiar .env.example
cp .env.example .env.local

# 3. Editar .env.local (agregar tus IDs)
code .env.local

# 4. Aplicar migración (desde dashboard de Supabase)
# https://app.supabase.com/project/[tu-project]/sql

# 5. Personalizar torneo
code app/(marketing)/torneos/[id]/inscripcion/page.tsx

# 6. Test local
bun run dev

# 7. Verificar build
bun run build

# 8. Deploy (si usas Vercel)
git add .
git commit -m "feat: add landing page system"
git push origin main

# ✅ LISTO!
```

---

## 📝 Checklist Final

```
Setup:
[ ] Migración aplicada en Supabase
[ ] .env.local configurado con FB_PIXEL_ID y GA4_ID
[ ] WhatsApp number actualizado
[ ] Nombre del torneo actualizado
[ ] Fecha de inicio actualizada

Testing:
[ ] Landing page carga sin errores
[ ] WhatsApp buttons funcionan
[ ] Formulario valida correctamente
[ ] Formulario envía y guarda en DB
[ ] Admin dashboard muestra datos
[ ] Facebook Pixel detecta eventos
[ ] Google Analytics muestra tráfico

Deploy:
[ ] Build exitoso (bun run build)
[ ] Variables en Vercel configuradas
[ ] Deploy completado
[ ] URL de producción funciona

Marketing:
[ ] Facebook Pixel verificado
[ ] Primera campaña creada
[ ] UTM parameters configurados
[ ] Presupuesto definido
```

---

**¿Todo listo?** 🚀

Si completaste el checklist, tu landing page está lista para recibir tráfico de Facebook Ads y convertir leads en equipos inscritos.

**Próximo paso:** Crear tu primera campaña en Facebook Ads Manager con la URL:
```
https://tudominio.com/torneos/copa-verano-2025/inscripcion?utm_source=facebook&utm_medium=cpc&utm_campaign=verano-2025
```
