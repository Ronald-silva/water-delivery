const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = "mongodb+srv://zionman81:9MO2AJ4uo9FdBIUG@cluster0.zmlal.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('water-delivery');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = { connectDB, client };