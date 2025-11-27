-- Migration 012: Enable RLS on Missing Tables
-- Fix Supabase security linter errors for tables without RLS policies
-- Date: 2025-01-26

-- =====================================================
-- TOURNAMENT STRUCTURE TABLES
-- Public read, Admin write
-- =====================================================

-- Enable RLS on fases_eliminatorias
ALTER TABLE fases_eliminatorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY fases_eliminatorias_select_all ON fases_eliminatorias
  FOR SELECT
  USING (true);

CREATE POLICY fases_eliminatorias_insert_admin ON fases_eliminatorias
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY fases_eliminatorias_update_admin ON fases_eliminatorias
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY fases_eliminatorias_delete_admin ON fases_eliminatorias
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on jornadas
ALTER TABLE jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY jornadas_select_all ON jornadas
  FOR SELECT
  USING (true);

CREATE POLICY jornadas_insert_admin ON jornadas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY jornadas_update_admin ON jornadas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY jornadas_delete_admin ON jornadas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on llaves_eliminatorias
ALTER TABLE llaves_eliminatorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY llaves_eliminatorias_select_all ON llaves_eliminatorias
  FOR SELECT
  USING (true);

CREATE POLICY llaves_eliminatorias_insert_admin ON llaves_eliminatorias
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY llaves_eliminatorias_update_admin ON llaves_eliminatorias
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY llaves_eliminatorias_delete_admin ON llaves_eliminatorias
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on mejores_perdedores
ALTER TABLE mejores_perdedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY mejores_perdedores_select_all ON mejores_perdedores
  FOR SELECT
  USING (true);

CREATE POLICY mejores_perdedores_insert_admin ON mejores_perdedores
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY mejores_perdedores_update_admin ON mejores_perdedores
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY mejores_perdedores_delete_admin ON mejores_perdedores
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- PEOPLE TABLES
-- Public read, Admin write
-- =====================================================

-- Enable RLS on dirigentes
ALTER TABLE dirigentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY dirigentes_select_all ON dirigentes
  FOR SELECT
  USING (true);

CREATE POLICY dirigentes_insert_admin ON dirigentes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY dirigentes_update_own ON dirigentes
  FOR UPDATE
  USING (
    -- Director can update own profile
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY dirigentes_delete_admin ON dirigentes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on arbitros
ALTER TABLE arbitros ENABLE ROW LEVEL SECURITY;

CREATE POLICY arbitros_select_all ON arbitros
  FOR SELECT
  USING (true);

CREATE POLICY arbitros_insert_admin ON arbitros
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY arbitros_update_admin ON arbitros
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY arbitros_delete_admin ON arbitros
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- EVENT/TRANSACTION TABLES
-- Admin only (sensitive data)
-- =====================================================

-- Enable RLS on eventos_partido
ALTER TABLE eventos_partido ENABLE ROW LEVEL SECURITY;

CREATE POLICY eventos_partido_select_all ON eventos_partido
  FOR SELECT
  USING (true); -- Public can see match events

CREATE POLICY eventos_partido_insert_admin ON eventos_partido
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY eventos_partido_update_admin ON eventos_partido
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY eventos_partido_delete_admin ON eventos_partido
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on eventos_torneo
ALTER TABLE eventos_torneo ENABLE ROW LEVEL SECURITY;

CREATE POLICY eventos_torneo_select_all ON eventos_torneo
  FOR SELECT
  USING (true); -- Public can see tournament events

CREATE POLICY eventos_torneo_insert_admin ON eventos_torneo
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY eventos_torneo_update_admin ON eventos_torneo
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY eventos_torneo_delete_admin ON eventos_torneo
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS on pagos_arbitro (SENSITIVE - Admin only)
ALTER TABLE pagos_arbitro ENABLE ROW LEVEL SECURITY;

CREATE POLICY pagos_arbitro_select_admin ON pagos_arbitro
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY pagos_arbitro_insert_admin ON pagos_arbitro
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY pagos_arbitro_update_admin ON pagos_arbitro
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY pagos_arbitro_delete_admin ON pagos_arbitro
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE fases_eliminatorias IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE jornadas IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE llaves_eliminatorias IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE mejores_perdedores IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE dirigentes IS 'RLS Enabled: Public read, director update own profile, admin full access';
COMMENT ON TABLE arbitros IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE eventos_partido IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE eventos_torneo IS 'RLS Enabled: Public read, admin write';
COMMENT ON TABLE pagos_arbitro IS 'RLS Enabled: Admin only (sensitive financial data)';
