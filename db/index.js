/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @format
 * @flow
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
require('dotenv').config()
const {
  Pool,
  // Client
} = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  // host: process.env.HOST_EXT,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  pool,
  // Client
}
