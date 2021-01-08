'use strict';

const UIDGenerator = require('uid-generator');
const pool = require('../../DB/pool');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const uidgen = new UIDGenerator();
