// backend/src/routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const deliveryRouteController = require('../controllers/deliveryRouteController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Validações para criação/atualização de rota
const validateRouteData = [
 validate.requiredFields([
   'name',
   'deliveryMan'
 ])
];

// Rotas básicas de CRUD
router.post('/', validateRouteData, deliveryRouteController.create);
router.get('/', deliveryRouteController.list);
router.get('/stats', deliveryRouteController.getStats);
router.get('/:id', deliveryRouteController.get);
router.put('/:id', validateRouteData, deliveryRouteController.update);
router.delete('/:id', auth.authenticate, auth.isAdmin, deliveryRouteController.delete);

// Rotas para gerenciar pedidos na rota
router.patch('/:id/add-order', 
 validate.requiredFields(['orderId']),
 deliveryRouteController.addOrder
);

router.patch('/:id/remove-order', 
 validate.requiredFields(['orderId']),
 deliveryRouteController.removeOrder
);

router.patch('/:id/reorder', 
 validate.requiredFields(['orderIds']),
 deliveryRouteController.reorderDeliveries
);

// Atualização de status
router.patch('/:id/status',
 validate.requiredFields(['status']),
 deliveryRouteController.updateStatus
);

module.exports = router;