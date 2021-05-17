'use strict';

const axios = require('axios');
const UIDGenerator = require('uid-generator');
const db = require('./db.module');
const config = require('../../config');
const { statusChanger, courses } = require('./status.module');
const ExcelTable = require('./excel.module');

const uidgen = new UIDGenerator(); // token generator
const statuses = statusChanger();

function onText(ctx) {
  const userID = ctx.message.from.id;
  const username = ctx.message.from.username;
  const currStatus = statuses.get(userID);
  const text = ctx.message.text;
  const functions = {
    'courseName': onCourseNameGet,
    'labNumb': onLabNumGet,
    'testNumb': onTestNumGet,
    'additional': onAdditGet,
    'check': onCheck,
  }
  if (currStatus) {
    const dataToGet = currStatus.split(':')[1];
    console.log(dataToGet);
    for (let prop in functions) {
      if (dataToGet === prop) functions[prop](ctx, text, userID);
    }
  } else {
    ctx.reply('Используйте команды для общения с ботом');
  }
}

function onCourseNameGet(ctx, text, userID) { // on courseName waited
  courses[userID].courseName = text;
  statuses.set(userID, 'wait:labNumb');
  ctx.reply(config.messages.labsAmountMessage);
}

function onLabNumGet(ctx, text, userID) { // on labsNumb waited
  const n = +text;
  if (n <= 10 && n >= 0) {
    courses[userID].labNumb = Math.floor(n);
    statuses.set(userID, 'wait:testNumb');
    ctx.reply(config.messages.testsAmountMessage);
  } else {
    ctx.reply(config.messages.labsAmountErrorMessage);
  }
}

function onTestNumGet(ctx, text, userID) { // on testsNumb waited
  const n = +text;
  if (n <= 5 && n >= 0) {
    courses[userID].testNumb = Math.floor(+text);
    statuses.set(userID, 'wait:additional');
    ctx.reply(config.messages.additionalMessage);
  } else {
    ctx.reply(config.messages.testsAmountErrorMessage);
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
    ctx.reply(config.messages.dismissMessage);
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
    ctx.reply(config.messages.addGroupErrorMessage);
  } else {
    answerWithCourses(ctx, coursesExist, false);
  }
}

async function onGetList(ctx) { // on bot /get_list
  const userID = ctx.message.from.id;
  const coursesExist = await db.getCourses(userID);
  if (!coursesExist.length) {
    ctx.reply(config.messages.addGroupErrorMessage);
  } else {
    answerWithCourses(ctx, coursesExist, true);
  }
}

function onGetCourse(ctx) { // on bot /get_course
  const userID = ctx.message.from.id;
  statuses.set(userID, 'wait:courseName');
  courses[userID] = {
    courseID: uidgen.generateSync(),
  };
  ctx.reply(config.messages.courseNameMessage);
}

async function onDocument(ctx) { // on bot document
  const userID = ctx.message.from.id;
  const currStatus = statuses.get(userID);
  const courseID = currStatus.split(':')[2];
  const { 'file_id': fileId } = ctx.update.message.document;
  const fileUrl = await ctx.telegram.getFileLink(fileId);
  const response = await axios.get(fileUrl.href);
  const groupList = response.data.split('\n');
  const groupName = groupList.shift();
  const withTokens = response.data.split('\n');
  withTokens.shift();
  const cgID = uidgen.generateSync();
  const {
    labs_number: labsN,
    tests_number: testsN,
    additional,
  } = await db.getCourseInfo(courseID);
  await db.fillStudentsTable(ctx, groupList, groupName, courseID, withTokens);
  await db.insertCG(cgID, courseID, groupName);
  await db.createCourseXTable(cgID, labsN, testsN, additional);
  await db.fillCourseXTable(cgID, withTokens, labsN, testsN, additional);
}

function answerWithCourses(ctx, answer, isListNeeded) { // answers with courses keyboard
  const inlineKeyboard = [];
  answer.forEach(course => inlineKeyboard.push([
    {
      text: course['course_name'],
      'callback_data':
        `course:${course['course_id']}${isListNeeded ? ':list' : ''}`,
    },
  ]));
  const keyboard = {
    'reply_markup': JSON.stringify({
      'inline_keyboard': inlineKeyboard,
    }),
  };
  ctx.reply('Выберите курс:', keyboard);
}

async function onCBquery(ctx) { // on bot callback query
  const userID = ctx.update['callback_query'].message.chat.id;
  const messageID = ctx.update['callback_query'].message['message_id'];
  ctx.deleteMessage(messageID);
  const data = ctx.update['callback_query'].data;
  const dataToGet = data.split(':');
  if (dataToGet[2] && !dataToGet[3]) {
    const groups = await db.getCourseGroups(dataToGet[1]);
    answerWithGroups(ctx, groups);
  } else if (dataToGet[3]) {
    const cgID = dataToGet[1];
    const groupList = await db.getCourseX(cgID);
    const table = new ExcelTable();
    await table.configureTable(ctx, groupList, cgID, userID);
  } else if (dataToGet[0] === 'course') {
    const replyText = config.messages.groupListFormatMessage;
    statuses.set(userID, `wait:list:${dataToGet[1]}`);
    ctx.reply(replyText);
  }
}

function answerWithGroups(ctx, groups) { // answers with groups keyboard
  const inlineKeyBoard = [];
  groups.forEach(group => inlineKeyBoard.push([
    {
      text: group['group_name'],
      'callback_data': `course:${group['cg_id']}:group:${group['group_name']}`,
    },
  ]));
  const keyboard = {
    'reply_markup': JSON.stringify({
      'inline_keyboard': inlineKeyBoard,
    }),
  };
  ctx.reply('Выберите группу:', keyboard);
}

module.exports = {
  onText,
  isDocWaited,
  onAddGroup,
  onGetList,
  onGetCourse,
  onDocument,
  onCBquery,
};
