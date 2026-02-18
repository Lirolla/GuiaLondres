-- ============================================
-- DADOS INICIAIS - GUIA LONDRES AWARDS
-- Cole este SQL no phpMyAdmin e execute
-- ============================================

-- 1. INSERIR USUÁRIO ADMIN
INSERT INTO users (email, password_hash, name, role) VALUES 
('contato@lirolla.com', '$2y$10$YourHashedPasswordHere', 'Admin', 'super_admin');

-- 2. INSERIR BANNERS
INSERT INTO banners (title, subtitle, image_url, display_order, active) VALUES 
('Guia Londres Awards 2026', 'Celebrando a Comunidade Brasileira em Londres', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920', 1, TRUE),
('Vote nos Seus Favoritos', 'Sua opinião faz a diferença!', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920', 2, TRUE),
('Cerimônia de Premiação', 'Não perca a grande noite!', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920', 3, TRUE);

-- 3. INSERIR PARCEIROS
INSERT INTO partners (name, logo_url, description, contact_email, website_url) VALUES 
('Guia Londres', 'https://via.placeholder.com/200x100?text=Guia+Londres', 'O maior portal da comunidade brasileira em Londres', 'contato@guialondres.co.uk', 'https://guialondres.co.uk'),
('Brazilian Times', 'https://via.placeholder.com/200x100?text=Brazilian+Times', 'Notícias e informações para brasileiros no Reino Unido', 'contato@braziliantimes.co.uk', 'https://braziliantimes.co.uk'),
('London School', 'https://via.placeholder.com/200x100?text=London+School', 'Escola de inglês para brasileiros', 'info@londonschool.co.uk', 'https://londonschool.co.uk');

-- 4. INSERIR VÍDEOS
INSERT INTO videos (title, youtube_url, category, description) VALUES 
('Podcast Ep. 1 - Vida em Londres', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'podcast', 'Conversamos sobre a vida da comunidade brasileira em Londres'),
('Podcast Ep. 2 - Empreendedorismo', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'podcast', 'Como empreender sendo brasileiro em Londres'),
('Conheça Nossos Parceiros', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'parceiros', 'Apresentação dos parceiros do Guia Londres Awards'),
('Comercial Guia Londres Awards', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'comerciais', 'Vídeo promocional do evento');

-- 5. INSERIR CATEGORIAS DE VOTAÇÃO
INSERT INTO categories (name, description, icon) VALUES 
('Melhor Restaurante', 'Vote no melhor restaurante brasileiro de Londres', '🍽️'),
('Melhor Cabeleireiro', 'Vote no melhor salão de beleza brasileiro', '💇'),
('Melhor Influenciador', 'Vote no influenciador brasileiro mais relevante', '📱'),
('Melhor Empresa de Serviços', 'Vote na melhor empresa de serviços para brasileiros', '🏢');

-- 6. INSERIR INDICADOS (NOMINEES)
INSERT INTO nominees (category_id, name, description, image_url, votes) VALUES 
-- Restaurantes
(1, 'Sabor Brasileiro', 'Restaurante de comida caseira brasileira', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', 0),
(1, 'Churrascaria Gaúcha', 'A melhor churrascaria de Londres', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 0),
(1, 'Café Mineiro', 'Café e quitandas mineiras', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', 0),
-- Cabeleireiros
(2, 'Salão Beleza Brasileira', 'Cortes e tratamentos capilares', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400', 0),
(2, 'Hair Studio London', 'Especialistas em cabelos cacheados', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400', 0),
-- Influenciadores
(3, 'João Silva', 'Criador de conteúdo sobre vida em Londres', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 0),
(3, 'Maria Santos', 'Influenciadora de lifestyle e cultura', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 0),
-- Empresas
(4, 'London Services BR', 'Serviços de documentação e consultoria', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400', 0),
(4, 'BR Logistics', 'Mudanças e logística internacional', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400', 0);

-- 7. INSERIR SORTEIOS
INSERT INTO giveaways (title, description, participants, winner_name, is_active) VALUES 
('Sorteio iPhone 15', 'Concorra a um iPhone 15 Pro Max', 0, NULL, TRUE),
('Sorteio Jantar Romântico', 'Jantar para 2 pessoas em restaurante brasileiro', 0, NULL, TRUE),
('Sorteio Vale Compras £500', 'Vale compras de £500 em lojas parceiras', 0, NULL, TRUE);

-- 8. CONFIGURAÇÃO DA LIVE
INSERT INTO live_config (stream_url, is_active, title, description) VALUES 
('https://www.youtube.com/embed/dQw4w9WgXcQ', FALSE, 'Cerimônia de Premiação AO VIVO', 'Acompanhe a cerimônia ao vivo direto de Londres');

-- 9. CONFIGURAÇÃO DO ESTÚDIO FOTOGRÁFICO
INSERT INTO studio_config (session_price, session_duration, start_time, end_time, lunch_start, lunch_end, available_days) VALUES 
(150.00, 60, '09:00:00', '18:00:00', '12:00:00', '13:00:00', 'Terça,Quarta,Quinta,Sexta');

-- ============================================
-- FIM DOS DADOS INICIAIS
-- ============================================
