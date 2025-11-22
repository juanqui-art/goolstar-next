-- Migration 006: Financial System
-- Payment tracking for inscriptions, fines, and referee payments

-- Transacciones Pago (Payment Transactions)
CREATE TABLE transacciones_pago (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID NOT NULL,
  torneo_id UUID NOT NULL,
  tipo tipo_transaccion NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  es_ingreso BOOLEAN DEFAULT TRUE, -- TRUE for payments in, FALSE for payments out
  descripcion TEXT,
  razon VARCHAR(255),
  partido_id UUID, -- If related to a specific match (for fines)
  tarjeta_id UUID, -- If it's a card fine
  jugador_id UUID, -- If it's a jugador-specific payment
  metodo_pago VARCHAR(50), -- 'efectivo', 'transferencia', 'cheque', etc.
  referencia_externa VARCHAR(100), -- Bank reference, check number, etc.
  pagado BOOLEAN DEFAULT FALSE,
  fecha_pago DATE,
  usuario_admin UUID, -- Who recorded the payment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE SET NULL,
  FOREIGN KEY (tarjeta_id) REFERENCES tarjetas(id) ON DELETE SET NULL,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE SET NULL,
  CONSTRAINT monto_positive CHECK (monto > 0)
);

-- Pagos Arbitro (Referee Payments)
CREATE TABLE pagos_arbitro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arbitro_id UUID NOT NULL,
  torneo_id UUID NOT NULL,
  partido_id UUID,
  monto DECIMAL(10,2) NOT NULL,
  pagado BOOLEAN DEFAULT FALSE,
  fecha_pago DATE,
  metodo_pago VARCHAR(50),
  referencia_externa VARCHAR(100),
  usuario_admin UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (arbitro_id) REFERENCES arbitros(id) ON DELETE CASCADE,
  FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
  FOREIGN KEY (partido_id) REFERENCES partidos(id) ON DELETE SET NULL,
  CONSTRAINT monto_positive CHECK (monto > 0)
);

-- Create indexes for performance
CREATE INDEX idx_transaccion_equipo ON transacciones_pago(equipo_id);
CREATE INDEX idx_transaccion_torneo ON transacciones_pago(torneo_id);
CREATE INDEX idx_transaccion_equipo_torneo ON transacciones_pago(equipo_id, torneo_id);
CREATE INDEX idx_transaccion_tipo ON transacciones_pago(tipo);
CREATE INDEX idx_transaccion_fecha ON transacciones_pago(created_at);
CREATE INDEX idx_transaccion_pagado ON transacciones_pago(pagado);
CREATE INDEX idx_transaccion_partido ON transacciones_pago(partido_id);
CREATE INDEX idx_transaccion_tarjeta ON transacciones_pago(tarjeta_id);

CREATE INDEX idx_pago_arbitro_arbitro ON pagos_arbitro(arbitro_id);
CREATE INDEX idx_pago_arbitro_torneo ON pagos_arbitro(torneo_id);
CREATE INDEX idx_pago_arbitro_pagado ON pagos_arbitro(pagado);
CREATE INDEX idx_pago_arbitro_fecha ON pagos_arbitro(created_at);

-- Add comments
COMMENT ON TABLE transacciones_pago IS 'Financial transactions: inscriptions, fines, adjustments';
COMMENT ON COLUMN transacciones_pago.es_ingreso IS 'TRUE = money in (payments), FALSE = money out (refunds)';
COMMENT ON TABLE pagos_arbitro IS 'Referee payment tracking per tournament/match';
