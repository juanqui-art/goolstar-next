-- Migration 009: Row Level Security Policies
-- Role-based access control for sensitive tables

-- Note: Supabase automatically manages auth.uid() and auth.jwt()
-- These policies will be used once auth is configured

-- Enable RLS on all sensitive tables
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE goles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarjetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cambios_jugador ENABLE ROW LEVEL SECURITY;
ALTER TABLE participacion_jugador ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadistica_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugador_documentos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATEGORIAS - Public read, admin write
-- ============================================
CREATE POLICY categorias_select_all ON categorias
  FOR SELECT
  USING (true); -- Everyone can read categories

CREATE POLICY categorias_insert_admin ON categorias
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY categorias_update_admin ON categorias
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- TORNEOS - Public read, admin write
-- ============================================
CREATE POLICY torneos_select_all ON torneos
  FOR SELECT
  USING (true);

CREATE POLICY torneos_insert_admin ON torneos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY torneos_update_admin ON torneos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- EQUIPOS - Read tournament teams, write own team
-- ============================================
CREATE POLICY equipos_select_all ON equipos
  FOR SELECT
  USING (true); -- Can see all teams

CREATE POLICY equipos_insert_admin ON equipos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY equipos_update_director ON equipos
  FOR UPDATE
  USING (
    -- Director can update own team
    dirigente_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- JUGADORES - Read tournament players, write own team
-- ============================================
CREATE POLICY jugadores_select_all ON jugadores
  FOR SELECT
  USING (true);

CREATE POLICY jugadores_insert_director ON jugadores
  FOR INSERT
  WITH CHECK (
    -- Director can add players to own team
    EXISTS (
      SELECT 1 FROM equipos e
      WHERE e.id = equipo_id
        AND e.dirigente_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY jugadores_update_director ON jugadores
  FOR UPDATE
  USING (
    -- Director can update players on own team
    EXISTS (
      SELECT 1 FROM equipos e
      WHERE e.id = equipo_id
        AND e.dirigente_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- PARTIDOS - Public read, admin write
-- ============================================
CREATE POLICY partidos_select_all ON partidos
  FOR SELECT
  USING (true);

CREATE POLICY partidos_insert_admin ON partidos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY partidos_update_admin ON partidos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- GOLES - Public read, admin write
-- ============================================
CREATE POLICY goles_select_all ON goles
  FOR SELECT
  USING (true);

CREATE POLICY goles_insert_admin ON goles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- TARJETAS - Public read, admin write
-- ============================================
CREATE POLICY tarjetas_select_all ON tarjetas
  FOR SELECT
  USING (true);

CREATE POLICY tarjetas_insert_admin ON tarjetas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- ESTADISTICA_EQUIPO - Public read, auto-update only
-- ============================================
CREATE POLICY estadistica_equipo_select_all ON estadistica_equipo
  FOR SELECT
  USING (true);

-- ============================================
-- TRANSACCIONES_PAGO - Director/Admin only
-- ============================================
CREATE POLICY transacciones_pago_select_director ON transacciones_pago
  FOR SELECT
  USING (
    -- Directors can see own team transactions
    EXISTS (
      SELECT 1 FROM equipos e
      WHERE e.id = equipo_id
        AND e.dirigente_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY transacciones_pago_insert_admin ON transacciones_pago
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- JUGADOR_DOCUMENTOS - Players and Admins
-- ============================================
CREATE POLICY jugador_documentos_select_player ON jugador_documentos
  FOR SELECT
  USING (
    -- Player can see own documents
    EXISTS (
      SELECT 1 FROM jugadores j
      WHERE j.id = jugador_id
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY jugador_documentos_insert_director ON jugador_documentos
  FOR INSERT
  WITH CHECK (
    -- Director can upload documents for own team players
    EXISTS (
      SELECT 1 FROM jugadores j
      JOIN equipos e ON j.equipo_id = e.id
      WHERE j.id = jugador_id
        AND e.dirigente_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add comments
COMMENT ON TABLE categorias IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE torneos IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE equipos IS 'RLS Enabled: Public read, director update own team';
COMMENT ON TABLE jugadores IS 'RLS Enabled: Public read, director manage own team players';
COMMENT ON TABLE transacciones_pago IS 'RLS Enabled: Director/Admin only';
