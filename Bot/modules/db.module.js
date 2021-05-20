'use strict';
 
const UIDGenerator = require('uid-generator');
const pool = require('../../DB/pool');
const config = require('../../config');
 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
process.on('unhandledRejection', error => {
  console.log(error);
  process.exit();
});
process.on('exit', () => {
  pool.end();
});
 
const uidgen = new UIDGenerator();
 
function insertData(query, ctx, message) { // for insert/create query
  const promise = new Promise(async (resolve, reject) => {
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
  });
  return promise;
}
 
function selectData(query, responseHandler = x => x) { // for select query
  const promise = new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      const response = await client.query(query);
      await client.release();
      resolve(responseHandler(response));
    } catch (e) {
      console.log(e);
      await client.release();
      reject();
    }
  });
  return promise;
}
 
function insertCourse(ctx, courses, userID, username) { // adds course for teacher / register teacher if needed
  const currCourse = courses[userID];
  const query = `INSERT INTO Courses VALUES
  ('${currCourse.courseID}', '${currCourse.courseName}', ${userID}, 
    ${currCourse.labNumb}, ${currCourse.testNumb}, ${+currCourse.additional})`;
  const promise = new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      await client.query(query);
      await client.release();
      ctx.reply(config.messages.successCourseMessage);
      const isRegistred = await isTeacherRegistred(userID);
      if (!isRegistred) {
        await insertTeacher(ctx, userID, username);
      }
      resolve();
    } catch (e) {
      await client.release();
      console.log(e);
      ctx.reply(config.messages.dismissMessage);
      reject();
    }
  });
  return promise;
}
 
async function setMark(course_id, student_name, where, mark) {
  (async () => {
  const total = await prevTotal(course_id, student_name) + Number(mark);
  const query = `UPDATE public.course_${course_id}
    SET ${where}=${mark}, Total=${total} WHERE student_name='${student_name}'`;
  await insertData(query);
  await setLetterGrade(course_id, student_name);
  })();
}
 
function setLetterGrade(course_id, student_name) {
  let letter;
  (async () => { 
    let result = await prevTotal(course_id, student_name);
    for (let point in config.letters) {
      if (result >= point) letter = config.letters[point];
    };
    const query = `UPDATE public.course_${course_id}
      SET Letter='${letter}' WHERE student_name='${student_name}'`;
    return insertData(query);
  })();
}
 
function prevTotal(course_id, student_name) { // return prevTotal
  const query = `SELECT Total FROM public.course_${course_id} 
  WHERE student_name='${student_name}'`;
  return selectData(query, res => res.rows[0].total);
}
 
function isTeacherRegistred(userID) { // checks if teacher is registred
  const query = `SELECT name FROM public.teachers WHERE teacher_id=${userID}`;
  return selectData(query, res => res.rows.length);
}
 
function insertTeacher(ctx, userID, username) { // adds teacher to teachers
  const query = `INSERT INTO Teachers VALUES (${userID}, '${username}')`;
  const message = config.messages.teacherRegistredMessage;
  return insertData(query, ctx, message);
}
 
function createCourseXTable(cgID, labsN, testsN, additional) { // creates table for new course
  const table = createCourseXTableTemplate(labsN, testsN, additional);
  const query = createCourseXTableQuery(cgID, table);
  return insertData(query);
}
 
function createCourseXTableQuery(cgID, table) { // creates query for function above
  let tableQuery = `CREATE TABLE IF NOT EXISTS Course_${cgID} `;
  tableQuery += '(';
  for (const field in table) { // add field and data type
    tableQuery += ` ${field} ${table[field]}`;
    if (field !== 'PRIMARY KEY') tableQuery += ',';
  }
  tableQuery += ')';
  return tableQuery;
}
 
function createCourseXTableTemplate(labsN, testsN, additional) { // creates template for function above
  const table = {
    'student_id': 'varchar',
    'student_number': 'int',
    'student_name': 'varchar',
  };
  for (let i = 1; i <= labsN; i++) { // add labs
    table[`Lab_${i}`] = 'float';
  }
  for (let i = 1; i <= testsN; i++) { // add tests
    table[`Test_${i}`] = 'float';
  }
  if (additional) { // add adds
    table['Additional'] = 'float';
  }
  table['Total'] = 'int';
  table['Letter'] = 'varchar';
  table['PRIMARY KEY'] = '(student_id)';
  return table;
}
 
function fillCourseXTable(cgID, withTokens, labsN, testsN, additional) { // inserts students to course X
  const qry = createCourseXInsert(cgID, withTokens, labsN, testsN, additional);
  return insertData(qry);
}
 
function createCourseXInsert(cgID, withTokens, labsN, testsN, additional) { // creates query for function above
  const total = 0;
  const insertQuery = `INSERT INTO Course_${cgID} VALUES `;
  const arrayToAdd = [];
  withTokens.forEach((student, number) => {
    const arr = [student[0], number + 1, student[1], labsN, testsN, additional];
    const newField = createCourseXField(...arr);
    arrayToAdd.push(newField);
  });
  arrayToAdd.forEach((x, i) => {
    arrayToAdd[i][0] = `'${arrayToAdd[i][0]}'`;
    arrayToAdd[i][2] = `'${arrayToAdd[i][2]}'`;
  });
  const strToAdd = arrayToAdd
    .map(field => field.join(', '))
    .join('),\n(');
  return `${insertQuery}(${strToAdd})`;
}
 
function createCourseXField(id, number, name, labsN, testsN, isAdditional) { // creates fields for function above
  const returnArr = [id, number, name];
  for (let i = 0; i <= labsN + testsN + +isAdditional + 1; i++) {
    returnArr.push(0);
  }
  //returnArr.push(0);
  return returnArr;
}
 
function getCourseX(courseID) { // gets student from course X
  const query = `SELECT * FROM public.course_${courseID}`;
  return selectData(query, res => getList(res.rows));
}
 
function getList(response) { // handles recieved students list
  const list = [];
  for (let i = 0; i < response.length; i++) {
    const item = response[i];
    list[i] = [];
    for (const key in item) {
      if (key !== 'student_id') {
        list[i].push([key, item[key]]);
      }
    }
  }
  return list;
}
 
function getCourseInfo(courseID) { // gets number of labs, tests etc from courses
  const query = `SELECT labs_number, tests_number, additional 
    FROM public.courses WHERE course_id='${courseID}'`;
  return selectData(query, res => res.rows[0]);
}
 
function insertCG(cgID, courseID, groupName) { // adds course/group relationship
  const query = `INSERT INTO Courses_Groups VALUES 
  ('${cgID}', '${courseID}', '${groupName}')`;
  return insertData(query);
}
 
function getCourses(userID) { // gets courses by teacher
  const query = `SELECT course_ID, course_name 
    FROM public.courses 
    WHERE teacher_id=${userID}`;
  return selectData(query, res => res.rows);
}
 
function fillStudentsTable(ctx, groupList, groupName, courseID, withTokens) { // inserts students to table
  const qry = createStudentsInsert(groupList, groupName, courseID, withTokens);
  const message = config.messages.studentsAddedMessage;
  return insertData(qry, ctx, message);
}
 
function createStudentsInsert(groupList, groupName, courseID, listWithTokens) { // creates query for function above
  const dataToinsert = groupList
    .map((name, index) => {
      const token = uidgen.generateSync();
      listWithTokens[index] = [token, name];
      return [`'${token}'`, index + 1, `'${name}'`,
        `'${groupName}'`, `'${courseID}'`];
    })
    .map(arr => arr.join(', '))
    .join('), \n (');
  const studentsQuery = `INSERT INTO Students VALUES (${dataToinsert})`;
  return studentsQuery;
}
 
function getCourseGroups(courseID) { // gets courses/group relationship by course id
  const query = `SELECT * 
    FROM public.courses_groups WHERE course_id='${courseID}'`;
  return selectData(query, res => res.rows);
}
 
module.exports = {
  createCourseXTable,
  getCourseInfo,
  insertCG,
  getCourses,
  insertCourse,
  fillStudentsTable,
  getCourseGroups,
  fillCourseXTable,
  getCourseX,
  setMark,
};
 
 

