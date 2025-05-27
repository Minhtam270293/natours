// tests/environment/setupMongo.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

exports.dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create(); 
  const uri = mongoServer.getUri(); 

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

   return uri;
};

exports.dbDisconnect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } catch (error) {
    console.warn('Error during DB disconnect:', error.message);
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};
