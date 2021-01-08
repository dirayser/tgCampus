'use strict'

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  ssl: config.ssl,
});

module.exports = pool;