-- Migration: Pre-inscripciones para Torneos (Landing Page + Facebook Ads)
-- Purpose: Capture leads from Facebook Ads campaigns with UTM tracking
-- Date: 2025-01-25
-- Version: SIMPLIFIED (without usuarios table dependency)

-- =====================================================
-- 1. Create preinscripciones_torneo table
-- =====================================================
CREATE TABLE IF NOT EXISTS preinscripciones_torneo (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relación con torneo (NULLABLE para fase de testing)
  torneo_id UUID,

  -- Datos de contacto (mínimos 3 campos)
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,

  -- UTM tracking para analytics
  utm_source VARCHAR(100),      -- Ej: 'facebook', 'instagram'
  utm_medium VARCHAR(100),       -- Ej: 'cpc', 'social'
  utm_campaign VARCHAR(100),     -- Ej: 'torneo-verano-2025'
  utm_content VARCHAR(100),      -- Ej: 'cta-whatsapp', 'cta-form'
  utm_term VARCHAR(100),         -- Ej: 'futbol-cuenca'

  -- Tracking adicional
  referrer TEXT,                 -- HTTP Referer header
  landing_page_url TEXT,         -- URL exacta donde se registró

  -- Estado del lead
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'contactado', 'confirmado', 'rechazado', 'convertido')),

  -- Seguimiento manual por admin
  fecha_contacto TIMESTAMPTZ,
  notas_seguimiento TEXT,

  -- Metadata técnica
  user_agent TEXT,               -- Para análisis de dispositivos
  ip_address VARCHAR(45),        -- IPv4 o IPv6

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. Create indexes for performance
-- =====================================================

-- Index para búsqueda por email (evitar duplicados)
CREATE INDEX idx_preinscripciones_email
ON preinscripciones_torneo(email);

-- Index para búsqueda por teléfono
CREATE INDEX idx_preinscripciones_telefono
ON preinscripciones_torneo(telefono);

-- Index para analytics por campaña
CREATE INDEX idx_preinscripciones_utm_campaign
ON preinscripciones_torneo(utm_campaign)
WHERE utm_campaign IS NOT NULL;

-- Index para analytics por source
CREATE INDEX idx_preinscripciones_utm_source
ON preinscripciones_torneo(utm_source)
WHERE utm_source IS NOT NULL;

-- Index para ordenar por fecha
CREATE INDEX idx_preinscripciones_created_at
ON preinscripciones_torneo(created_at DESC);

-- Index por estado
CREATE INDEX idx_preinscripciones_estado
ON preinscripciones_torneo(estado);

-- =====================================================
-- 3. Create trigger for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_preinscripciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_preinscripciones_updated_at
  BEFORE UPDATE ON preinscripciones_torneo
  FOR EACH ROW
  EXECUTE FUNCTION update_preinscripciones_updated_at();

-- =====================================================
-- 4. Row Level Security (RLS) Policies - SIMPLIFIED
-- =====================================================

-- Enable RLS
ALTER TABLE preinscripciones_torneo ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can INSERT (public landing page)
-- No authentication required for pre-registration
CREATE POLICY "Anyone can create preinscripciones"
  ON preinscripciones_torneo
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Policy 2: Any authenticated user can SELECT
-- TEMPORARY: Until usuarios table exists, allow all authenticated
CREATE POLICY "Authenticated users can view preinscripciones"
  ON preinscripciones_torneo
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Any authenticated user can UPDATE
-- TEMPORARY: Until usuarios table exists, allow all authenticated
CREATE POLICY "Authenticated users can update preinscripciones"
  ON preinscripciones_torneo
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. Useful views for analytics
-- =====================================================

-- View: Conversion funnel by campaign
CREATE OR REPLACE VIEW vista_conversion_por_campana
WITH (security_invoker = true) AS
SELECT
  utm_campaign,
  utm_source,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE estado = 'contactado') as contactados,
  COUNT(*) FILTER (WHERE estado = 'confirmado') as confirmados,
  COUNT(*) FILTER (WHERE estado = 'convertido') as convertidos,
  ROUND(
    (COUNT(*) FILTER (WHERE estado = 'convertido')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
    2
  ) as tasa_conversion_pct,
  MIN(created_at) as primera_inscripcion,
  MAX(created_at) as ultima_inscripcion
FROM preinscripciones_torneo
WHERE utm_campaign IS NOT NULL
GROUP BY utm_campaign, utm_source
ORDER BY total_leads DESC;

-- View: Daily registrations
CREATE OR REPLACE VIEW vista_inscripciones_diarias
WITH (security_invoker = true) AS
SELECT
  DATE(created_at) as fecha,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE utm_source = 'facebook') as desde_facebook,
  COUNT(*) FILTER (WHERE utm_content LIKE '%whatsapp%') as via_whatsapp,
  COUNT(*) FILTER (WHERE utm_content LIKE '%form%') as via_formulario
FROM preinscripciones_torneo
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- =====================================================
-- 6. Helper function: Check for duplicate
-- =====================================================

CREATE OR REPLACE FUNCTION existe_preinscripcion(
  p_torneo_id UUID,
  p_email VARCHAR,
  p_telefono VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM preinscripciones_torneo
    WHERE (p_torneo_id IS NULL OR torneo_id = p_torneo_id)
    AND (
      LOWER(email) = LOWER(p_email)
      OR telefono = p_telefono
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. Comments for documentation
-- =====================================================

COMMENT ON TABLE preinscripciones_torneo IS 'Pre-registrations from landing page for Facebook Ads campaigns. No authentication required for INSERT.';
COMMENT ON COLUMN preinscripciones_torneo.estado IS 'Lead status: pendiente (new), contactado (admin contacted), confirmado (team confirmed), rechazado (declined), convertido (team created in system)';
COMMENT ON COLUMN preinscripciones_torneo.utm_source IS 'Traffic source (facebook, instagram, google, etc.)';
COMMENT ON COLUMN preinscripciones_torneo.utm_campaign IS 'Campaign identifier for analytics';
COMMENT ON COLUMN preinscripciones_torneo.utm_content IS 'CTA identifier (whatsapp-hero, form-sticky, etc.)';

-- =====================================================
-- End of migration
-- =====================================================
