const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/config', async (req, res) => {
  try {
    const [config] = await db.query('SELECT * FROM studio_config LIMIT 1');
    const [availability] = await db.query('SELECT * FROM studio_availability');
    res.json({ config: config[0], availability });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar config' });
  }
});

router.put('/config', authMiddleware, async (req, res) => {
  try {
    const { sessionPrice, sessionDuration } = req.body;
    await db.query('UPDATE studio_config SET session_price = ?, session_duration = ? WHERE id = 1', [sessionPrice, sessionDuration]);
    res.json({ message: 'Configuração atualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

module.exports = router;
