import 'dotenv/config';
import fs from 'fs';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function initDB() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
        console.log('Executing init.sql...');
        await pool.query(sql);
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    } finally {
        await pool.end();
    }
}

initDB();
