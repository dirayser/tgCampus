'use strict';

const axios = require('axios');
const UIDGenerator = require('uid-generator');
const db = require('./db.module');
const { statusChanger, courses } = require('./status.module');
const createExcel = require('./excel.module');

const uidgen = new UIDGenerator(); // token generator
const statuses = statusChanger();

function onCourseNameGet(ctx, text, userID) { // on courseName waited
  courses[userID].courseName = text;
  statuses.set(userID, 'wait:labNumb');
  ctx.reply('Количество лабораторных работ в курсе:');
}
