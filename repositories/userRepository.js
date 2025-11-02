const { getPool } = require('../db');
const pool = getPool();

const findAll = async ()=> {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

const create = async (name)=> {
    const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
    return result.rows[0];
};

module.exports = {
    findAll,
    create
};