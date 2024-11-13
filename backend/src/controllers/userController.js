// backend/src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const userController = {
 // Criar um novo usuário
 async create(req, res) {
   try {
     const user = await User.create(req.body);
     res.status(201).json(user);
   } catch (error) {
     if (error.code === 11000) { // MongoDB duplicate key error
       return res.status(400).json({ error: 'Email já cadastrado' });
     }
     res.status(400).json({ error: error.message });
   }
 },

 // Login
 async login(req, res) {
   try {
     const { email, password } = req.body;
     
     const user = await User.validateCredentials(email, password);
     if (!user) {
       return res.status(401).json({ error: 'Credenciais inválidas' });
     }

     if (!user.active) {
       return res.status(401).json({ error: 'Usuário inativo' });
     }

     const token = jwt.sign(
       { 
         id: user._id,
         role: user.role 
       },
       process.env.JWT_SECRET,
       { expiresIn: '24h' }
     );

     res.json({ user, token });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Listar todos os usuários
 async list(req, res) {
   try {
     const users = await User.findAll();
     res.json(users);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Buscar um usuário específico
 async get(req, res) {
   try {
     const user = await User.findById(req.params.id);
     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }
     res.json(user);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Atualizar um usuário
 async update(req, res) {
   try {
     const user = await User.update(req.params.id, req.body);
     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }
     res.json(user);
   } catch (error) {
     if (error.code === 11000) {
       return res.status(400).json({ error: 'Email já cadastrado' });
     }
     res.status(500).json({ error: error.message });
   }
 },

 // Atualizar senha
 async updatePassword(req, res) {
   try {
     const { currentPassword, newPassword } = req.body;
     const user = await User.findById(req.params.id);

     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }

     // Validar senha atual
     const isValid = await User.validateCredentials(user.email, currentPassword);
     if (!isValid) {
       return res.status(401).json({ error: 'Senha atual incorreta' });
     }

     // Atualizar senha
     await User.update(req.params.id, { password: newPassword });
     res.json({ message: 'Senha atualizada com sucesso' });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Ativar/Desativar usuário
 async toggleActive(req, res) {
   try {
     const user = await User.findById(req.params.id);
     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }

     const updatedUser = await User.update(req.params.id, { 
       active: !user.active 
     });

     res.json(updatedUser);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Deletar um usuário
 async delete(req, res) {
   try {
     const success = await User.delete(req.params.id);
     if (!success) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }
     res.status(204).send();
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Buscar perfil do usuário logado
 async getProfile(req, res) {
   try {
     const user = await User.findById(req.user.id);
     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }
     res.json(user);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 },

 // Atualizar perfil do usuário logado
 async updateProfile(req, res) {
   try {
     const user = await User.update(req.user.id, req.body);
     if (!user) {
       return res.status(404).json({ error: 'Usuário não encontrado' });
     }
     res.json(user);
   } catch (error) {
     if (error.code === 11000) {
       return res.status(400).json({ error: 'Email já cadastrado' });
     }
     res.status(500).json({ error: error.message });
   }
 }
};

module.exports = userController;