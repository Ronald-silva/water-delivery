// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

// Importar rotas
const orderRoutes = require('./orders');
const deliveryRoutes = require('./deliveryRoutes');
const userRoutes = require('./users');

// Definir rotas base
router.use('/orders', orderRoutes);
router.use('/delivery-routes', deliveryRoutes);
router.use('/users', userRoutes);

// Rota de verificação de saúde da API
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;