-- ============================================
-- GUIA LONDRES AWARDS - DATABASE SCHEMA
-- ============================================
-- Para importar na Hostinger:
-- 1. Acesse phpMyAdmin na Hostinger
-- 2. Crie um novo banco de dados
-- 3. Importe este arquivo SQL
-- ============================================

-- Criar banco de dados (opcional - pode já existir na Hostinger)
CREATE DATABASE IF NOT EXISTS guia_londres_awards 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE guia_londres_awards;

-- ============================================
-- TABELA: users (Usuários Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: banners (Banners do Hero)
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: categories (Categorias de Votação)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: nominees (Indicados)
-- ============================================
CREATE TABLE IF NOT EXISTS nominees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_votes (votes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: votes (Registro de Votos)
-- ============================================
CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nominee_id INT NOT NULL,
  voter_ip VARCHAR(45),
  voter_fingerprint VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nominee_id) REFERENCES nominees(id) ON DELETE CASCADE,
  INDEX idx_nominee (nominee_id),
  INDEX idx_ip (voter_ip),
  INDEX idx_fingerprint (voter_fingerprint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: partners (Parceiros/Patrocinadores)
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT,
  contact VARCHAR(255),
  website_url TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: videos (Vídeos por Categoria)
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  category ENUM('podcast', 'parceiros', 'comerciais') NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: giveaways (Sorteios)
-- ============================================
CREATE TABLE IF NOT EXISTS giveaways (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: giveaway_participants (Participantes dos Sorteios)
-- ============================================
CREATE TABLE IF NOT EXISTS giveaway_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  giveaway_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (giveaway_id) REFERENCES giveaways(id) ON DELETE CASCADE,
  INDEX idx_giveaway (giveaway_id),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: live_config (Configuração da Live)
-- ============================================
CREATE TABLE IF NOT EXISTS live_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stream_url TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: studio_config (Configuração do Estúdio)
-- ============================================
CREATE TABLE IF NOT EXISTS studio_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_price DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  session_duration INT NOT NULL DEFAULT 60,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: studio_availability (Disponibilidade do Estúdio)
-- ============================================
CREATE TABLE IF NOT EXISTS studio_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week INT NOT NULL, -- 0=Domingo, 1=Segunda, ..., 6=Sábado
  enabled BOOLEAN DEFAULT FALSE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  lunch_start TIME,
  lunch_end TIME,
  UNIQUE KEY unique_day (day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: bookings (Agendamentos do Estúdio)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (booking_date),
  INDEX idx_email (client_email),
  INDEX idx_paid (paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Usuário Admin Master (senha: Pagotto24)
-- Hash gerado com bcrypt
INSERT INTO users (email, password_hash, name, role) VALUES
('contato@lirolla.com', '$2b$10$rZ5vN8yX9KqE.jQm0YvLZOxH3wKJ7pT2mL4nR6sW8eU1oC3iA5gH.', 'Admin Master', 'super_admin');

-- Banner Inicial
INSERT INTO banners (title, subtitle, image_url, display_order) VALUES
('GUIA LONDRES AWARDS • EDIÇÃO 2024', 'Celebrating the best of the Brazilian community in London', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920', 1);

-- Categoria de Exemplo
INSERT INTO categories (name, description, display_order) VALUES
('Best Brazilian Restaurant', 'Vote no melhor restaurante brasileiro de Londres', 1);

-- Indicados de Exemplo
INSERT INTO nominees (category_id, name, description, image_url) VALUES
(1, 'Sabor de Casa', 'Traditional feijoada experts', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'),
(1, 'Grill Master London', 'Elite steakhouse experience', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400');

-- Parceiros de Exemplo
INSERT INTO partners (name, logo_url, description, contact, website_url, display_order) VALUES
('Premium London Agency', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400', 'Agência premium de marketing e eventos em Londres', 'contato@premiumlondon.com', 'https://premiumlondon.com', 1),
('Taste of Brazil', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', 'Restaurante brasileiro autêntico no coração de Londres', 'info@tasteofbrazil.co.uk', 'https://tasteofbrazil.co.uk', 2);

-- Vídeo de Exemplo
INSERT INTO videos (title, url, category, description, display_order) VALUES
('Last Year Highlights', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'comerciais', 'Melhores momentos da edição anterior', 1);

-- Sorteio de Exemplo
INSERT INTO giveaways (title, description, image_url) VALUES
('Dinner for Two at Savoy', 'Register to participate in our luxury dinner draw!', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800');

-- Configuração da Live
INSERT INTO live_config (stream_url, is_live) VALUES
('', FALSE);

-- Configuração do Estúdio
INSERT INTO studio_config (session_price, session_duration) VALUES
(50.00, 60);

-- Disponibilidade do Estúdio (Terça-feira das 9h às 17h)
INSERT INTO studio_availability (day_of_week, enabled, start_time, end_time, lunch_start, lunch_end) VALUES
(2, TRUE, '09:00:00', '17:00:00', '12:00:00', '13:00:00');

-- ============================================
-- FIM DO SCRIPT
-- ============================================
