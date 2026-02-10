const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/nominees', require('./routes/nominees'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/giveaways', require('./routes/giveaways'));
app.use('/api/live', require('./routes/live'));
app.use('/api/studio', require('./routes/studio'));
app.use('/api/bookings', require('./routes/bookings'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Guia Londres Awards API is running' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});

module.exports = app;
