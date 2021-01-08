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

function onTestNumGet(ctx, text, userID) { // on testsNumb waited
  const n = +text;
  if (n <= 5 && n >= 0) {
    courses[userID].testNumb = Math.floor(+text);
    statuses.set(userID, 'wait:additional');
    ctx.reply('Наличие дополнительных баллов: (y/n)');
  } else {
    ctx.reply('0 <= Количество контрольных <= 5');
  }
}


function onAdditGet(ctx, text, userID) { // on additional waited
  courses[userID].additional = text.toLowerCase() === 'y';
  statuses.set(userID, 'wait:check');
  ctx.reply('Всё верно? (y/n)\n' + JSON.stringify(courses[userID]));
}

async function onCheck(ctx, text, userID, username) { // on check waited
  if (text.toLowerCase() === 'y') {
    await db.insertCourse(ctx, courses, userID, username);
  } else {
    ctx.reply('Курс не добавлен');
  }
  statuses.unset(userID);
}

function isDocWaited(ctx) { // checks if document is waited
  const userID = ctx.message.from.id;
  const currStatus = statuses.get(userID);
  if (currStatus) {
    const dataToGet = currStatus.split(':')[1];
    return dataToGet === 'list';
  }
  return false;
}

async function onAddGroup(ctx) { // on bot /add_group
  const userID = ctx.message.from.id;
  const coursesExist = await db.getCourses(userID);
  if (!coursesExist.length) {
    ctx.reply('Отсутствуют курсы для добавления групп');
  } else {
    answerWithCourses(ctx, coursesExist, false);
  }
}
