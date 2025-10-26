const express = require('express')
const app = express();

app.use(express.json());

let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob'}
];

app.get('/users', (req, res) => {
    res.status(200).json(users);
});

app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});

module.exports = server;