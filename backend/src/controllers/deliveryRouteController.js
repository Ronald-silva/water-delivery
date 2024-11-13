// backend/src/controllers/deliveryRouteController.js
const DeliveryRoute = require('../models/DeliveryRoute');

const deliveryRouteController = {
  // Criar uma nova rota
  async create(req, res) {
    try {
      const route = await DeliveryRoute.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todas as rotas
  async list(req, res) {
    try {
      const routes = await DeliveryRoute.findAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar uma rota específica
  async get(req, res) {
    try {
      const route = await DeliveryRoute.findById(req.params.id);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Atualizar uma rota
  async update(req, res) {
    try {
      const route = await DeliveryRoute.update(req.params.id, req.body);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Atualizar status da rota
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const route = await DeliveryRoute.updateStatus(req.params.id, status);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Adicionar pedido à rota
  async addOrder(req, res) {
    try {
      const { orderId } = req.body;
      const route = await DeliveryRoute.addOrder(req.params.id, orderId);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Remover pedido da rota
  async removeOrder(req, res) {
    try {
      const { orderId } = req.body;
      const route = await DeliveryRoute.removeOrder(req.params.id, orderId);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reordenar entregas
  async reorderDeliveries(req, res) {
    try {
      const { orderIds } = req.body;
      const route = await DeliveryRoute.reorderDeliveries(req.params.id, orderIds);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Deletar uma rota
  async delete(req, res) {
    try {
      const success = await DeliveryRoute.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar estatísticas
  async getStats(req, res) {
    try {
      const stats = await DeliveryRoute.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = deliveryRouteController;