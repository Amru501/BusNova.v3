-- Bus Pass Management System - Database Schema
-- Run this in your MySQL client to create the database and tables.

CREATE DATABASE IF NOT EXISTS bus_pass;
USE bus_pass;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  password VARCHAR(255),
  role ENUM('student','admin'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins: separate table for admin_id, role (checking/driver/administrator), name, phone
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE,
  role ENUM('checking','driver','administrator'),
  name VARCHAR(100),
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Routes: admin sets daily/weekly price per route
CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  daily_price DECIMAL(10,2),
  weekly_price DECIMAL(10,2),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_number VARCHAR(50),
  route_id INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Passes: user selects route (not bus); amount comes from route's price
-- A pass expires exactly 6 months after it becomes active (when approved).
CREATE TABLE passes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  route_id INT,
  pass_type ENUM('daily','weekly'),
  amount DECIMAL(10,2),
  payment_status ENUM('pending','paid','failed') DEFAULT 'pending',
  approval_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  is_active BOOLEAN DEFAULT FALSE,
  active_at TIMESTAMP NULL COMMENT 'When the pass became active (upon approval)',
  expires_at TIMESTAMP NULL COMMENT 'Exactly 6 months after active_at',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pass_id INT,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  status ENUM('success','failed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pass_id) REFERENCES passes(id)
);
