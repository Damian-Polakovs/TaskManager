"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.collections = exports.usersCollection = exports.gradeHistoriesCollection = void 0;
exports.connectToDatabase = connectToDatabase;
exports.closeDatabaseConnection = closeDatabaseConnection;
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.MONGO_URI || "";
const dbName = process.env.DB_NAME || "Web2_2024";
const options = {
    maxPoolSize: 50,
    minPoolSize: 10,
    retryWrites: true,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};
const client = new mongodb_1.MongoClient(connectionString, options);
exports.client = client;
let db;
exports.collections = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!connectionString) {
                throw new Error("MongoDB connection string is not defined in environment variables");
            }
            // Connect to MongoDB
            yield client.connect();
            // Test connection
            yield client.db("admin").command({ ping: 1 });
            console.log("Successfully connected to MongoDB.");
            db = client.db(dbName);
            exports.gradeHistoriesCollection = db.collection('gradeHistories');
            exports.usersCollection = db.collection('users');
            exports.collections.gradeHistories = exports.gradeHistoriesCollection;
            exports.collections.users = exports.usersCollection;
            yield Promise.all([
                exports.gradeHistoriesCollection.createIndex({ student_id: 1 }),
                exports.gradeHistoriesCollection.createIndex({ class_id: 1 }),
                exports.gradeHistoriesCollection.createIndex({ "scores.type": 1 }),
                exports.usersCollection.createIndex({ email: 1 }, { unique: true }),
                exports.usersCollection.createIndex({ phonenumber: 1 }, { unique: true })
            ]);
            console.log("Database indexes created successfully");
        }
        catch (error) {
            console.error("Database connection failed:", error);
            throw error;
        }
    });
}
function closeDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.close();
            console.log("Database connection closed successfully");
        }
        catch (error) {
            console.error("Error closing database connection:", error);
            throw error;
        }
    });
}
function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase() first.");
    }
    return db;
}
client.on('error', (error) => {
    console.error('MongoDB client error:', error);
});
client.on('timeout', () => {
    console.warn('MongoDB operation timeout');
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received SIGINT. Closing MongoDB connection...');
    yield closeDatabaseConnection();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received SIGTERM. Closing MongoDB connection...');
    yield closeDatabaseConnection();
    process.exit(0);
}));
