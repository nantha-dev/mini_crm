import { Router } from 'express';

const router = Router();

// Helper: get cached list or fetch from DB
const getCachedContacts = async (req) => {
    const { redis } = req;
    const cacheKey = 'contacts:list';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const { rows } = await req.db.query('SELECT * FROM contacts ORDER BY id');
    await redis.setEx(cacheKey, 60, JSON.stringify(rows)); // cache 60s
    return rows;
};

// Invalidate cache after any mutation
const invalidateCache = async (req) => {
    await req.redis.del('contacts:list');
};

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await getCachedContacts(req);
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new contact
router.post('/', async (req, res) => {
    const { name, email, phone, company } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    try {
        const { rows } = await req.db.query(
            'INSERT INTO contacts (name, email, phone, company) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, company]
        );
        await invalidateCache(req);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update contact
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    try {
        const { rows } = await req.db.query(
            'UPDATE contacts SET name=$1, email=$2, phone=$3, company=$4 WHERE id=$5 RETURNING *',
            [name, email, phone, company, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await invalidateCache(req);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await req.db.query('DELETE FROM contacts WHERE id=$1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await invalidateCache(req);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;