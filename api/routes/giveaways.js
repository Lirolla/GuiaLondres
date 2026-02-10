const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [giveaways] = await db.query('SELECT * FROM giveaways WHERE active = TRUE');
    res.json(giveaways);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sorteios' });
  }
});

router.post('/:id/participate', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await db.query('INSERT INTO giveaway_participants (giveaway_id, name, email, phone) VALUES (?, ?, ?, ?)', [req.params.id, name, email, phone]);
    res.status(201).json({ message: 'Participação registrada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao participar' });
  }
});

module.exports = router;
