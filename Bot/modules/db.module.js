'use strict';

const UIDGenerator = require('uid-generator');
const pool = require('../../DB/pool');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
process.on('unhandledRejection', error => {
  console.log(error);
  pool.end();
});
process.on('exit', () => {
  pool.end();
})

const uidgen = new UIDGenerator();

function insertData(query, ctx, message) { // for insert/create query
  const promise = new Promise((resolve, reject) => {
    (async () => {
      const client = await pool.connect();
      try {
        await client.query(query);
        await client.release();
        if (ctx) ctx.reply(message);
        resolve();
      } catch (e) {
        await client.release();
        console.log(e);
        if (ctx) ctx.reply('Error');
        reject();
      }
    })();
  });
}
