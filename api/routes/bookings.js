const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.query('SELECT * FROM bookings ORDER BY booking_date DESC, start_time DESC');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, bookingDate, startTime, endTime, price } = req.body;
    const [result] = await db.query(
      'INSERT INTO bookings (client_name, client_email, client_phone, booking_date, start_time, end_time, price, paid) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)',
      [clientName, clientEmail, clientPhone, bookingDate, startTime, endTime, price]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Agendamento cancelado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar' });
  }
});

module.exports = router;
