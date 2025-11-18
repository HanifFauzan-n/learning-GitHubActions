require('dotenv').config();
const request = require('supertest')
const app = require('./app');
const {getPool} = require('./db')

const userService = require('./services/userService');

let server;
let pool;
let token;

const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password"
};

beforeAll( async ()=> {
    server = app;
    pool = getPool();

    await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );`
    );
})

beforeEach( async ()=> {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    jest.restoreAllMocks();
});

afterAll( async ()=> {
    await pool.end();
    server.close();
});

describe('API - POST /register', () => {

    it('harus berhasil mendaftarkan user baru (201)', async () => {
        const response = await request(server)
            .post('/register')
            .send(testUser); // Mengirim data user lengkap

        console.log("ISI RESPONSE BODY:", response.body);


        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(testUser.name);
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.password).toBeUndefined(); // Pastikan password tidak dikembalikan
    });

    it('harus gagal jika email sudah ada (400)', async () => {
        // Daftarkan user pertama kali
        await request(server).post('/register').send(testUser);

        // Coba daftarkan lagi dengan email yang sama
        const response = await request(server)
            .post('/register')
            .send(testUser);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Email is already in use");
    });

    it('harus gagal jika validasi Zod gagal (400)', async () => {
        const response = await request(server)
            .post('/register')
            .send({ name: "a", email: "b", password: "c" }); // Data tidak valid

        console.log("ISI RESPONSE BODY:", response.body);
        console.log("Text (Raw):", response.text);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid input");
        expect(response.body.details).toBeDefined();
    });
});

describe('Auth API - POST /login', () => {

    beforeEach(async () => {
        // Kita harus mendaftarkan user terlebih dahulu sebelum bisa login
        await request(server).post('/register').send(testUser);
    });

    it('harus berhasil login dan mengembalikan token (200)', async () => {
        const response = await request(server)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('harus gagal login dengan password salah (401)', async () => {
        const response = await request(server)
            .post('/login')
            .send({ email: testUser.email, password: "password_salah" });


        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Invalid credential");
    });
});


// ===================================
// TES BARU UNTUK ENDPOINT YANG AMAN
// ===================================
describe('API - GET /users', () => {

    it('harus gagal (401) jika tidak ada token', async () => {
        const response = await request(server).get('/users');
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("No token provided");
    });

    it('harus berhasil (200) jika token valid', async () => {
        // 1. Daftar
        await request(server).post('/register').send(testUser);
        
        // 2. Login untuk mendapatkan token
        const loginRes = await request(server)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        
        const token = loginRes.body.token;

        // 3. Panggil endpoint yang aman menggunakan token
        const response = await request(server)
            .get('/users')
            .set('Authorization', `Bearer ${token}`); // Atur header Authorization

            console.log("Length", response.body.length);

        expect(response.statusCode).toBe(200);
        // Harusnya mengembalikan 1 user yang baru kita daftarkan
        expect(response.body.length).toBe(1);
        expect(response.body[0].email).toBe(testUser.email);
    });

    it('harus mengembalikan error 500 jika service crash', async () => {
        // 1. Daftar & Login untuk mendapatkan token
        await request(server).post('/register').send(testUser);
        const loginRes = await request(server).post('/login').send({ email: testUser.email, password: testUser.password });
        const token = loginRes.body.token;

        // 2. Siapkan mock untuk MENGGAGALKAN service
        const errorMessage = "Database is down";
        jest.spyOn(userService, 'getAllUsers').mockRejectedValue(new Error(errorMessage));

        // 3. Panggil endpoint yang aman
        const response = await request(server)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        // 4. Pastikan controller menangkap error 500
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe(errorMessage);
    });
});