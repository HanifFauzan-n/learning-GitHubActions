const express = require('express')
const userRotes = require('./routes/userRoutes')
const app = express();

app.use(express.json());

app.use(userRotes);

const port = 3000;
const server = app.listen(port, () => {
    // console.log(`Server berjalan di port ${port}`);
});

module.exports = server;