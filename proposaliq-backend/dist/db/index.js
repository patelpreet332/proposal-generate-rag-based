"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const databaseUrl = env_1.ENV.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Please configure it in your environment or .env file.');
}
exports.pool = new pg_1.Pool({
    connectionString: databaseUrl,
});
const connectDB = async () => {
    const client = await exports.pool.connect();
    client.release();
    console.log('Database connection established');
};
exports.connectDB = connectDB;
