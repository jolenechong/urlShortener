import http from "http";
import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import CookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file configs into application environment
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import api from "./api/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(CookieParser());

app.use("/api", api);

// Create a proxy for the CRA dev server
if (process.env.NODE_ENV === 'production') {
    //* Set static folder up in production
    app.use(express.static('../client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html')));
} else if (process.env.NODE_ENV === 'development') {
    const feProxy = proxy("http://localhost:5173", {
        proxyReqPathResolver: (req) => new URL(req.originalUrl, `http://${req.headers.host}`).pathname || ""
    });
    app.use(feProxy);
}

// front end and backend will be running on 3001
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => console.log(`Server is listening on Port ${PORT}\nVisit http://localhost:3001 to view app`));

// initialize db here so the application works on fresh start
// Initialize database creation logic
async function initializeDatabase() {
    const defaultPool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "postgres", // Initially connect to the default database
        password: "admin",
        port: 5432
    });

    const client = await defaultPool.connect();
    
    // Create the database if it doesn't exist
    try {
        // Check if the database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'urlshorternerdb'");
        
        if (res.rowCount === 0) {
            await client.query("CREATE DATABASE urlshorternerdb");
            console.log('Database created.');
        } else {
            console.log('Database already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        client.release();
    }

    // Now connect to the newly created database
    const newPool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "urlshorternerdb", // Target the newly created database
        password: "admin",
        port: 5432
    });

    const dbClient = await newPool.connect();
    
    try {
        // Create tables if they don't exist
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE,
                password TEXT NOT NULL
            );
        `);

        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS urls (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                long_url TEXT NOT NULL,
                short_url TEXT NOT NULL UNIQUE,
                click_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        console.log("Tables 'users' and 'urls' are ready.");
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        dbClient.release();
    }
}

// Initialize the database and tables
initializeDatabase().catch((err) => console.error("Error initializing database:", err));

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "urlshorternerdb", // Target the newly created database
    password: "admin",
    port: 5432
});

export default pool;