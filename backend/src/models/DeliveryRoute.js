// backend/src/models/DeliveryRoute.js
const { ObjectId } = require('mongodb');
const { client } = require('../config/database');

const db = client.db('water-delivery');
const routes = db.collection('delivery_routes');

class DeliveryRoute {
  static async create(routeData) {
    const route = {
      ...routeData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await routes.insertOne(route);
    return { ...route, _id: result.insertedId };
  }

  static async findAll(query = {}) {
    return await routes.find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(id) {
    return await routes.findOne({ _id: new ObjectId(id) });
  }

  static async update(id, updateData) {
    const result = await routes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  static async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  static async delete(id) {
    const result = await routes.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async addOrder(id, orderId) {
    const result = await routes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { orders: new ObjectId(orderId) },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  static async removeOrder(id, orderId) {
    const result = await routes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $pull: { orders: new ObjectId(orderId) },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  static async reorderDeliveries(id, orderIds) {
    const orderObjectIds = orderIds.map(orderId => new ObjectId(orderId));
    const result = await routes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          orders: orderObjectIds,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  // Métodos para estatísticas
  static async getStats() {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalOrders: { $sum: { $size: '$orders' } }
        }
      }
    ];

    return await routes.aggregate(pipeline).toArray();
  }
}

module.exports = DeliveryRoute;