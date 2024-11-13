// backend/src/middlewares/error.js
const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    // Erro de validação do MongoDB
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(err.errors).map(error => error.message)
      });
    }
  
    // Erro de ID inválido do MongoDB
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'ID inválido'
      });
    }
  
    // Erro de chave duplicada do MongoDB
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Já existe um registro com este valor'
      });
    }
  
    // Erro geral da aplicação
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  };
  
  module.exports = errorHandler;