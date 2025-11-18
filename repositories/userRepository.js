const { getPool } = require('../db');
const pool = getPool();

const findAll = async ()=> {
    const result = await pool.query('SELECT id,name,email FROM users');
    return result.rows;
};

const findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

const create = async (name, email, passwordHash)=> {
    const result = await pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email', [name, email, passwordHash]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findByEmail,
    create
};