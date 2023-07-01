import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

async function setupTestEnvironment() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function teardownTestEnvironment() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

module.exports = {
  setupTestEnvironment,
  teardownTestEnvironment,
};
