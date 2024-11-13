// backend/src/models/User.js
const { ObjectId } = require('mongodb');
const { client } = require('../config/database');
const bcrypt = require('bcryptjs');

const db = client.db('water-delivery');
const users = db.collection('users');

class User {
  static async create(userData) {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'deliveryman',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(user);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  }

  static async findAll(query = {}) {
    const usersList = await users.find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return usersList.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async findById(id) {
    const user = await users.findOne({ _id: new ObjectId(id) });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async findByEmail(email) {
    return await users.findOne({ email });
  }

  static async update(id, updateData) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (result.value) {
      const { password, ...userWithoutPassword } = result.value;
      return userWithoutPassword;
    }
    return null;
  }

  static async delete(id) {
    const result = await users.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;