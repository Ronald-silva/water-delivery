// backend/src/middlewares/validate.js
const validate = {
    // Validar campos obrigatórios em uma requisição
    requiredFields(fields) {
      return (req, res, next) => {
        for (let field of fields) {
          if (!req.body[field]) {
            return res.status(400).json({
              error: `Campo "${field}" é obrigatório`
            });
          }
        }
        next();
      };
    },
  
    // Validar se os campos são do tipo correto
    types(typeChecks) {
      return (req, res, next) => {
        for (let [field, type] of Object.entries(typeChecks)) {
          if (req.body[field] && typeof req.body[field] !== type) {
            return res.status(400).json({
              error: `Campo "${field}" deve ser do tipo ${type}`
            });
          }
        }
        next();
      };
    },
  
    // Validar formato de email
    email(req, res, next) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (req.body.email && !emailRegex.test(req.body.email)) {
        return res.status(400).json({
          error: 'Email inválido'
        });
      }
      next();
    },
  
    // Validar força da senha
    password(req, res, next) {
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({
            error: 'A senha deve ter no mínimo 6 caracteres'
          });
        }
      }
      next();
    },
  
    // Validar formato do telefone
    phone(req, res, next) {
      const phoneRegex = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
      if (req.body.phone && !phoneRegex.test(req.body.phone)) {
        return res.status(400).json({
          error: 'Formato de telefone inválido. Use (XX) 9XXXX-XXXX'
        });
      }
      next();
    }
  };
  
  module.exports = validate;