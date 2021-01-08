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

function onLabNumGet(ctx, text, userID) { // on labsNumb waited
  const n = +text;
  if (n <= 10 && n >= 0) {
    courses[userID].labNumb = Math.floor(n);
    statuses.set(userID, 'wait:testNumb');
    ctx.reply('Количество контрольных работ в курсе:');
  } else {
    ctx.reply('0 <= Количество контрольных <= 10');
  }
}
