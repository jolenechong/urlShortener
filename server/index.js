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
import keys from "./keys.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv.config();

import api from "./api/index.js";

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  }));
app.use(express.json({ limit: '50mb' }));
app.use(CookieParser());

app.use("/api", api);
app.get("/", (req, res) => res.send("Welcome to the URL Shortener API"));

// Create a proxy for the CRA dev server

// if (process.env.NODE_ENV === 'production') {
//     //* Set static folder up in production
//     app.use(express.static('../client/build'));
//     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html')));
// } else if (process.env.NODE_ENV === 'development') {
//     const feProxy = proxy("http://localhost:5173", {
//         proxyReqPathResolver: (req) => new URL(req.originalUrl, `http://${req.headers.host}`).pathname || ""
//     });
//     app.use(feProxy);
// }

// front end and backend will be running on 5000
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => console.log(`Server is listening on Port ${PORT}\nVisit http://localhost:5000 to view app`));

// initialize db here so the application works on fresh start
console.log(keys)
const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pool.on("connect", client => {
    client
        .query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE,
                password TEXT NOT NULL
            );
        `)
        .catch(err => console.error("Error creating users table:", err));
    
    client
        .query(`
            CREATE TABLE IF NOT EXISTS urls (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                long_url TEXT NOT NULL,
                short_url TEXT NOT NULL UNIQUE,
                click_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `)
        .catch(err => console.error("Error creating urls table:", err));

})

export default pool;