import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { createClient } from 'redis';
import contactsRouter from './routes/contacts.js';

const { Pool } = pkg;

// PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Redis
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
await redisClient.connect();
redisClient.on('error', (err) => console.error('Redis error:', err));

const app = express();
app.use(cors());
app.use(express.json());

// Attach db and redis to request
app.use((req, res, next) => {
    req.db = pool;
    req.redis = redisClient;
    next();
});

// Routes
app.use('/api/contacts', contactsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));