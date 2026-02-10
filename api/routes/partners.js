const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Listar parceiros (público)
router.get('/', async (req, res) => {
  try {
    const [partners] = await db.query(
      'SELECT * FROM partners WHERE active = TRUE ORDER BY display_order ASC'
    );
    res.json(partners);
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    res.status(500).json({ error: 'Erro ao buscar parceiros' });
  }
});

// Criar parceiro (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, logoUrl, description, contact, websiteUrl, displayOrder } = req.body;

    const [result] = await db.query(
      'INSERT INTO partners (name, logo_url, description, contact, website_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, logoUrl, description, contact, websiteUrl, displayOrder || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Parceiro criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    res.status(500).json({ error: 'Erro ao criar parceiro' });
  }
});

// Atualizar parceiro (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, description, contact, websiteUrl, displayOrder, active } = req.body;

    await db.query(
      'UPDATE partners SET name = ?, logo_url = ?, description = ?, contact = ?, website_url = ?, display_order = ?, active = ? WHERE id = ?',
      [name, logoUrl, description, contact, websiteUrl, displayOrder, active, id]
    );

    res.json({ message: 'Parceiro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    res.status(500).json({ error: 'Erro ao atualizar parceiro' });
  }
});

// Deletar parceiro (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM partners WHERE id = ?', [id]);
    res.json({ message: 'Parceiro deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar parceiro:', error);
    res.status(500).json({ error: 'Erro ao deletar parceiro' });
  }
});

module.exports = router;
