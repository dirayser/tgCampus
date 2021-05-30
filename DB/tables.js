'use strict';

const tables = {
  'Public.Teachers': {
    'teacher_id': 'int',
    'name': 'varchar',
    'PRIMARY KEY': '(teacher_id)',
  },
  'Public.Courses': {
    'course_id': 'varchar',
    'course_name': 'varchar',
    'teacher_id': 'int',
    'labs_number': 'int',
    'tests_number': 'int',
    'additional': 'int',
    'PRIMARY KEY': '(course_id)',
  },
  'Public.Courses_Groups': {
    'cg_id': 'varchar',
    'course_id': 'varchar',
    'group_name': 'varchar',
    'PRIMARY KEY': '(cg_id)',
  },
  'Public.Students': {
    'student_id': 'varchar',
    'student_number': 'int',
    'student_name': 'varchar',
    'group_name': 'varchar',
    'course_id': 'varchar',
    'PRIMARY KEY': '(student_id)',
  },
};

module.exports = tables;
