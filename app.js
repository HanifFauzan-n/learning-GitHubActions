const express = require('express')
const {getPool} = require('./db.js')
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const pool = getPool();

        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message});
    }
});

app.post('/users', async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(400).json( {error: "Name is required"});
        }
        const pool = getPool();

        const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message});
    }
});

const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});

module.exports = server;