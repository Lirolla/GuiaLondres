const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Listar todos os banners (público)
router.get('/', async (req, res) => {
  try {
    const [banners] = await db.query(
      'SELECT * FROM banners WHERE active = TRUE ORDER BY display_order ASC'
    );
    res.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    res.status(500).json({ error: 'Erro ao buscar banners' });
  }
});

// Criar banner (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, imageUrl, displayOrder } = req.body;

    const [result] = await db.query(
      'INSERT INTO banners (title, subtitle, image_url, display_order) VALUES (?, ?, ?, ?)',
      [title, subtitle, imageUrl, displayOrder || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Banner criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    res.status(500).json({ error: 'Erro ao criar banner' });
  }
});

// Atualizar banner (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, displayOrder, active } = req.body;

    await db.query(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, display_order = ?, active = ? WHERE id = ?',
      [title, subtitle, imageUrl, displayOrder, active, id]
    );

    res.json({ message: 'Banner atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar banner:', error);
    res.status(500).json({ error: 'Erro ao atualizar banner' });
  }
});

// Deletar banner (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ message: 'Banner deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar banner:', error);
    res.status(500).json({ error: 'Erro ao deletar banner' });
  }
});

module.exports = router;
