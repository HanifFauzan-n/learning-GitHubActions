require('dotenv').config();
const request = require('supertest')
const app = require('./app');
const {getPool} = require('./db')

let server;
let pool;

beforeAll( async ()=> {
    server = app;
    pool = getPool();

    await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );`
    );
})

beforeEach( async ()=> {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
});

afterAll( async ()=> {
    await pool.end();
    server.close();
});



describe('API Pengguna', () => {
    

    it('GET /users -- harus mengembalikan users ', async () => {
        const response = await request(server).get('/users');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
        // expect(response.body.length).toBeGreaterThan(0);
    });

    it('POST /users -- harus membuat user baru ', async () => {
        const response = await request(server).post('/users').send({ name: 'Hanif'});

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('Hanif');
        expect(response.body.id).toBeDefined();

        const result = await pool.query('SELECT * FROM users WHERE name = $1 ', ["Hanif"]);
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].name).toBe('Hanif');
    });

});