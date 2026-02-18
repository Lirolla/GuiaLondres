-- ============================================
-- QUERIES DE TESTE - GUIA LONDRES AWARDS
-- ============================================
-- Execute estas queries no phpMyAdmin para verificar se o banco está funcionando

-- 1. Verificar se todas as tabelas foram criadas
SHOW TABLES;

-- 2. Verificar usuário admin
SELECT * FROM users;

-- 3. Verificar banners
SELECT * FROM banners;

-- 4. Verificar parceiros
SELECT * FROM partners;

-- 5. Verificar vídeos
SELECT * FROM videos;

-- 6. Verificar categorias de votação
SELECT * FROM categories;

-- 7. Verificar indicados
SELECT * FROM nominees;

-- 8. Verificar configuração do estúdio
SELECT * FROM studio_config;

-- 9. Verificar sorteios
SELECT * FROM giveaways;

-- 10. Verificar configuração da live
SELECT * FROM live_config;

-- ============================================
-- QUERIES PARA ADICIONAR DADOS DE TESTE
-- ============================================

-- Adicionar um banner de teste
INSERT INTO banners (title, subtitle, image_url, display_order, active) 
VALUES ('Guia Londres Awards 2026', 'Celebrando a comunidade brasileira em Londres', 'https://via.placeholder.com/1920x1080', 1, TRUE);

-- Adicionar um parceiro de teste
INSERT INTO partners (name, logo_url, description, contact_email, website_url) 
VALUES ('Parceiro Teste', 'https://via.placeholder.com/200', 'Descrição do parceiro de teste', 'contato@parceiro.com', 'https://parceiro.com');

-- Adicionar um vídeo de teste
INSERT INTO videos (title, youtube_url, category, description) 
VALUES ('Vídeo Teste', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'podcast', 'Descrição do vídeo de teste');

-- Adicionar uma categoria de votação
INSERT INTO categories (name, description, icon) 
VALUES ('Melhor Restaurante', 'Vote no melhor restaurante brasileiro de Londres', '🍽️');

-- Adicionar um indicado
INSERT INTO nominees (category_id, name, description, image_url, votes) 
VALUES (1, 'Restaurante Teste', 'Um excelente restaurante brasileiro', 'https://via.placeholder.com/400', 0);

-- ============================================
-- QUERY PARA VERIFICAR CONTAGEM
-- ============================================

SELECT 
  'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'partners', COUNT(*) FROM partners
UNION ALL
SELECT 'videos', COUNT(*) FROM videos
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'nominees', COUNT(*) FROM nominees
UNION ALL
SELECT 'giveaways', COUNT(*) FROM giveaways
UNION ALL
SELECT 'live_config', COUNT(*) FROM live_config
UNION ALL
SELECT 'studio_config', COUNT(*) FROM studio_config;
