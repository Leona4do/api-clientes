-- ============================================
-- Script de creación de base de datos
-- Taller de Plataformas Web - Semana 9
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS taller_web
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taller_web;

-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente  INT          NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_cliente),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba (opcional)
INSERT INTO cliente (nombre, email, telefono) VALUES
  ('Ana García',    'ana.garcia@email.com',   '+56912345678'),
  ('Luis Pérez',    'luis.perez@email.com',   '+56987654321'),
  ('María López',   'maria.lopez@email.com',  '+56955555555');
