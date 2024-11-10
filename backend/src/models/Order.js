const { ObjectId } = require('mongodb');
const { client } = require('../config/database');

const db = client.db('water-delivery');
const orders = db.collection('orders');

class Order {
  static async create(orderData) {
    const order = {
      ...orderData,
      createdAt: new Date(),
      status: 'PENDING',
      updatedAt: new Date()
    };

    const result = await orders.insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  static async findAll(query = {}) {
    return await orders.find(query).sort({ createdAt: -1 }).toArray();
  }

  static async findById(id) {
    return await orders.findOne({ _id: new ObjectId(id) });
  }

  static async update(id, updateData) {
    const result = await orders.findOneAndUpdate(
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
    const result = await orders.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async findByStatus(status) {
    return await this.findAll({ status });
  }

  // Métodos adicionais para estatísticas
  static async getStats() {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      }
    ];

    return await orders.aggregate(pipeline).toArray();
  }
}

module.exports = Order;