const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories WHERE active = TRUE ORDER BY display_order ASC');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;
    const [result] = await db.query(
      'INSERT INTO categories (name, description, display_order) VALUES (?, ?, ?)',
      [name, description, displayOrder || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Categoria deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

module.exports = router;
