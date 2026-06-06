const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  port: 1433,
  database: process.env.DB_NAME || 'RentFarmingDB',
  options: {
    encrypt: false, // set true for Azure
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log('✅ Connected to MS SQL Server');
  }
  return pool;
};

module.exports = { sql, getPool };
