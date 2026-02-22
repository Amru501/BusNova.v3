-- Migration: add routes table, switch buses and passes to use route_id
-- Run only if you have the OLD schema (buses.route VARCHAR, passes.bus_id).

USE bus_pass;

-- 1. Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  daily_price DECIMAL(10,2),
  weekly_price DECIMAL(10,2),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 2. Add route_id to buses (nullable first), backfill from existing route string, then drop route column
ALTER TABLE buses ADD COLUMN route_id INT NULL AFTER bus_number;
ALTER TABLE buses ADD FOREIGN KEY (route_id) REFERENCES routes(id);
-- Backfill: create one route per distinct route string and set buses.route_id (run in app or manually)
-- Then: ALTER TABLE buses DROP COLUMN route; ALTER TABLE buses MODIFY route_id INT NOT NULL;

-- 3. Add route_id to passes, backfill from bus's route, then drop bus_id
ALTER TABLE passes ADD COLUMN route_id INT NULL AFTER user_id;
ALTER TABLE passes ADD FOREIGN KEY (route_id) REFERENCES routes(id);
-- Backfill: UPDATE passes p JOIN buses b ON p.bus_id = b.id SET p.route_id = b.route_id;
-- Then: ALTER TABLE passes DROP FOREIGN KEY passes_ibfk_2; ALTER TABLE passes DROP COLUMN bus_id; ALTER TABLE passes MODIFY route_id INT NOT NULL;

-- If starting fresh, use schema.sql instead.
