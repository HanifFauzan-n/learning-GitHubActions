const { Pool } = require('pg');
require('dotenv').config();

let pool; 

function getPool(){
    if(pool){
        return pool;
    }


if(process.env.NODE_ENV === 'test'){
    pool = new Pool({
        host: '127.0.0.1',
        user: 'postgres',
        password: process.env.DB_PASSWORD || 'trNXYmebzvybLcvFekXpTWvZyHQUaCBP',
        database: 'test_db',
        port: 5432,
    });
} else {
    if(!process.env.DATABASE_URL){
        throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
}

return pool;

}

module.exports = {getPool};