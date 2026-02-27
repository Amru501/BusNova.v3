-- Add 6-month expiry columns to existing passes table.
-- Run this if your database was created before expiry was added.
-- Usage: mysql -u user -p bus_pass < scripts/add-pass-expiry-columns.sql

USE bus_pass;

ALTER TABLE passes
  ADD COLUMN active_at TIMESTAMP NULL COMMENT 'When the pass became active (upon approval)' AFTER is_active,
  ADD COLUMN expires_at TIMESTAMP NULL COMMENT 'Exactly 6 months after active_at' AFTER active_at;

-- Optional: backfill active_at/expires_at for already-approved passes (set to created_at + 6 months from now as placeholder if you prefer, or leave NULL).
-- UPDATE passes SET active_at = created_at, expires_at = DATE_ADD(created_at, INTERVAL 6 MONTH) WHERE is_active = 1 AND active_at IS NULL;
