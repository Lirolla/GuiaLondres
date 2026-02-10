const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [nominees] = await db.query('SELECT * FROM nominees ORDER BY category_id, votes DESC');
    res.json(nominees);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar indicados' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { categoryId, name, description, imageUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO nominees (category_id, name, description, image_url) VALUES (?, ?, ?, ?)',
      [categoryId, name, description, imageUrl]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar indicado' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM nominees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Indicado deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar indicado' });
  }
});

module.exports = router;
