const Order = require('../models/Order');

const orderController = {
  // Criar um novo pedido
  async create(req, res) {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todos os pedidos
  async list(req, res) {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar um pedido específico
  async get(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Atualizar um pedido
  async update(req, res) {
    try {
      const order = await Order.update(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Atualizar status do pedido
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await Order.updateStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Deletar um pedido
  async delete(req, res) {
    try {
      const success = await Order.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar estatísticas
  async getStats(req, res) {
    try {
      const stats = await Order.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = orderController;