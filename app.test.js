const request = require('supertest')
const app = require('./app');

describe('API Pengguna', () => {
    let server;

    beforeAll(() => {
        server = app;
    });

    afterAll((done) => {
        server.close(done);
    });

    it('GET /users -- harus mengembalikan semua pengguna ', async () => {
        const response = await request(server).get('/users');

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('POST /users -- harus membuat user baru ', async () => {
        const response = await request(server).post('/users').send({ name: 'Charlie'});
    });

});