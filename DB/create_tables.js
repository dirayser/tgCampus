'use strict';

const tables = require('./tables.js');

const pool = require('./pool');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
process.on('unhandledRejection', () => {
  pool.end();
});

(async () => { // creates all tables
  for (const table in tables) {
    const query = createTableQuery(table, tables);
    const client = await pool.connect();
    try {
      await client.query(query);
      await client.release();
      console.log(`Table ${table} created`);
    } catch (e) {
      await client.release();
      console.log(e);
    }
  }
  pool.end();
})();
