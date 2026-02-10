const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Listar vídeos (público)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM videos WHERE active = TRUE';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY display_order ASC';
    
    const [videos] = await db.query(query, params);
    res.json(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeos' });
  }
});

// Criar vídeo (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, url, category, description, displayOrder } = req.body;

    const [result] = await db.query(
      'INSERT INTO videos (title, url, category, description, display_order) VALUES (?, ?, ?, ?, ?)',
      [title, url, category, description, displayOrder || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Vídeo criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({ error: 'Erro ao criar vídeo' });
  }
});

// Atualizar vídeo (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, category, description, displayOrder, active } = req.body;

    await db.query(
      'UPDATE videos SET title = ?, url = ?, category = ?, description = ?, display_order = ?, active = ? WHERE id = ?',
      [title, url, category, description, displayOrder, active, id]
    );

    res.json({ message: 'Vídeo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro ao atualizar vídeo' });
  }
});

// Deletar vídeo (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ message: 'Vídeo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro ao deletar vídeo' });
  }
});

module.exports = router;
