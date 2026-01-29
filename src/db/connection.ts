import { MongoClient, Db } from 'mongodb';
import config from 'src/config'

let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  client = new MongoClient(config.mongoUri);
  await client.connect();
  db = client.db();

  console.log('DB Connected');

  return db;
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Not connected');
  }

  return db;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('Connection closed');
  }
};
