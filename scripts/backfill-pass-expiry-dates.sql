-- Backfill active_at and expires_at for existing passes in the database.
-- Run this after add-pass-expiry-columns.sql (or on a DB that already has those columns).
-- Usage: mysql -u user -p bus_pass < scripts/backfill-pass-expiry-dates.sql

USE bus_pass;

-- For approved+active passes with NULL active_at: use created_at as the activation date.
UPDATE passes
SET active_at = created_at
WHERE approval_status = 'approved' AND is_active = 1 AND active_at IS NULL;

-- For any pass with active_at set but NULL expires_at: set expiry to 6 months after active_at.
UPDATE passes
SET expires_at = DATE_ADD(active_at, INTERVAL 6 MONTH)
WHERE active_at IS NOT NULL AND expires_at IS NULL;

-- Optional: give currently active passes 6 months from today instead of from created_at.
-- Uncomment the next two lines and run again if you prefer "all active passes expire 6 months from now".
-- UPDATE passes SET active_at = CURRENT_TIMESTAMP, expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 MONTH)
-- WHERE approval_status = 'approved' AND is_active = 1;
