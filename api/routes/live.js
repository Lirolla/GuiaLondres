const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [config] = await db.query('SELECT * FROM live_config LIMIT 1');
    res.json(config[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar config' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { streamUrl, isLive } = req.body;
    await db.query('UPDATE live_config SET stream_url = ?, is_live = ? WHERE id = 1', [streamUrl, isLive]);
    res.json({ message: 'Configuração atualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

module.exports = router;
