// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Validações para usuário
const validateUserData = [
  validate.requiredFields([
    'name',
    'email',
    'password'
  ]),
  validate.email,
  validate.password
];

// Rotas públicas
router.post('/login', 
  validate.requiredFields(['email', 'password']),
  userController.login
);

// Rotas que precisam de autenticação
router.use(auth.authenticate);

// Rotas do perfil do usuário logado
router.get('/profile', userController.getProfile);
router.put('/profile',
  validate.email,
  userController.updateProfile
);
router.patch('/profile/password',
  validate.requiredFields(['currentPassword', 'newPassword']),
  validate.password,
  userController.updatePassword
);

// Rotas que precisam de privilégio de admin
router.use(auth.isAdmin);

// CRUD de usuários
router.post('/', validateUserData, userController.create);
router.get('/', userController.list);
router.get('/:id', userController.get);
router.put('/:id', validateUserData, userController.update);
router.delete('/:id', userController.delete);

// Ativar/desativar usuário
router.patch('/:id/toggle-active', userController.toggleActive);

module.exports = router;