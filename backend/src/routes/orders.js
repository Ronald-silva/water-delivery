// backend/src/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

// Validações para criação/atualização de pedido
const validateOrderData = [
  validate.requiredFields([
    'customerName',
    'phone',
    'address',
    'items',
    'paymentMethod'
  ]),
  validate.phone
];

// Listar pedidos e estatísticas
router.get('/', orderController.list);
router.get('/stats', orderController.getStats);

// Rotas com validação de dados
router.post('/', validateOrderData, orderController.create);
router.put('/:id', validateOrderData, orderController.update);

// Rotas específicas por ID
router.get('/:id', orderController.get);

// Atualização de status
router.patch('/:id/status', 
  validate.requiredFields(['status']),
  orderController.updateStatus
);

// Deletar pedido (requer autenticação admin)
router.delete('/:id', auth.authenticate, auth.isAdmin, orderController.delete);

module.exports = router;