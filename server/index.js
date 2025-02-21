import http from "http";
import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import url from "url";
import CookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";

// if (!process.env.MONGODB_URI) { throw new Error("MONGODB_URI not set in environment!"); }
// connect(process.env.MONGODB_URI);

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
        proxyReqPathResolver: (req) => url.parse(req.originalUrl).path || ""
    });
    app.use(feProxy);
}

// front end and backend will be running on 3001
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => console.log(`Server is listening on Port ${PORT}\nVisit http://localhost:3001 to view app`));