const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nomineeId, voterIp, voterFingerprint } = req.body;
    await db.query('INSERT INTO votes (nominee_id, voter_ip, voter_fingerprint) VALUES (?, ?, ?)', [nomineeId, voterIp, voterFingerprint]);
    await db.query('UPDATE nominees SET votes = votes + 1 WHERE id = ?', [nomineeId]);
    res.status(201).json({ message: 'Voto registrado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao votar' });
  }
});

module.exports = router;
