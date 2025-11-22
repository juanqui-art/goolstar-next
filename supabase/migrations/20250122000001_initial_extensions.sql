-- Migration 001: Initial Extensions and Enums
-- This migration enables required PostgreSQL extensions and defines custom types

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create nivel enum for player/team skill levels
CREATE TYPE nivel_enum AS ENUM ('1', '2', '3', '4', '5');

-- Create fase_torneo enum for tournament stages
CREATE TYPE fase_torneo AS ENUM (
  'inscripcion',
  'grupos',
  'octavos',
  'cuartos',
  'semifinales',
  'final',
  'finalizado'
);

-- Create tipo_tarjeta enum for card types
CREATE TYPE tipo_tarjeta AS ENUM ('AMARILLA', 'ROJA');

-- Create tipo_transaccion enum for financial transactions
CREATE TYPE tipo_transaccion AS ENUM (
  'abono_inscripcion',
  'pago_arbitro',
  'pago_balon',
  'multa_amarilla',
  'multa_roja',
  'ajuste_manual',
  'devolucion'
);

-- Create estado_documento enum for document verification
CREATE TYPE estado_documento AS ENUM ('pendiente', 'verificado', 'rechazado', 'resubir');

-- Create tipo_documento enum for document types
CREATE TYPE tipo_documento AS ENUM (
  'dni_frontal',
  'dni_posterior',
  'cedula_frontal',
  'cedula_posterior',
  'pasaporte',
  'otro'
);

-- Add helpful comment
COMMENT ON TYPE nivel_enum IS 'Skill levels for teams and players: 1=Beginner, 5=Expert';
COMMENT ON TYPE fase_torneo IS 'Tournament phases: registration → groups → knockout → final';
COMMENT ON TYPE tipo_tarjeta IS 'Yellow or red cards given during matches';
COMMENT ON TYPE tipo_transaccion IS 'Types of financial transactions in the system';
COMMENT ON TYPE estado_documento IS 'Document verification status';
COMMENT ON TYPE tipo_documento IS 'Document type for player verification';
