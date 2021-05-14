'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  user: config.postgre.user,
  host: config.postgre.host,
  database: config.postgre.database,
  password: config.postgre.password,
  port: config.postgre.port,
  ssl: config.postgre.ssl,
});

module.exports = pool;
