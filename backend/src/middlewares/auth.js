// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
  // Middleware de autenticação
  async authenticate(req, res, next) {
    try {
      // Verificar se tem o token no header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      // Verificar formato do token
      const [scheme, token] = authHeader.split(' ');
      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado' });
      }

      try {
        // Verificar validade do token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuário
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        if (!user.active) {
          return res.status(401).json({ error: 'Usuário inativo' });
        }

        // Adicionar usuário à requisição
        req.user = decoded;
        return next();
      } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Middleware de autorização para admin
  isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Acesso negado: necessário privilégios de administrador' 
      });
    }
    next();
  },

  // Middleware de autorização para entregador
  isDeliveryman(req, res, next) {
    if (req.user.role !== 'deliveryman' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Acesso negado: necessário privilégios de entregador' 
      });
    }
    next();
  },

  // Middleware para verificar se é o próprio usuário ou admin
  isSelfOrAdmin(req, res, next) {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ 
        error: 'Acesso negado: você só pode gerenciar seu próprio perfil' 
      });
    }
    next();
  }
};

module.exports = auth;