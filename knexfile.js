require('dotenv').config()

const pg = require('pg')

module.exports = {
  client: 'pg',
  connection: {
    host:     process.env.DATABASE_HOST,
    user:     process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  }
};