const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rotas de pedidos
router.post('/', orderController.create);
router.get('/', orderController.list);
router.get('/stats', orderController.getStats);
router.get('/:id', orderController.get);
router.put('/:id', orderController.update);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.delete);

module.exports = router;