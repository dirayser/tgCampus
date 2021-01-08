'use strict';

const UIDGenerator = require('uid-generator');
const pool = require('../../DB/pool');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
process.on('unhandledRejection', error => {
  console.log(error);
  pool.end();
});

const uidgen = new UIDGenerator();
