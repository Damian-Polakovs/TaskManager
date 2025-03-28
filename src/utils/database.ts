import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'Web2-2024';

let db: Db | null = null;
let client: MongoClient | null = null;

export const connectToDatabase = async (): Promise<Db> => {
    try {
        //If already connected, return the existing connection
        if (db) {
            return db;
        }
        
        client = await MongoClient.connect(url);
        db = client.db(dbName);
        console.log('Connected to MongoDB Atlas successfully');
        return db;
    } catch (error) {
        console.error('Could not connect to MongoDB Atlas:', error);
        throw error; //Let caller handle the error
    }
};

export const getDb = async (): Promise<Db> => {
    if (!db) {
        //Try to connect if not already connected
        try {
            return await connectToDatabase();
        } catch (error) {
            console.error('Failed to initialize database connection:', error);
            throw new Error('Database not initialized');
        }
    }
    return db;
};