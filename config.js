module.exports = {
  postgre: {
    user: process.env.dbUser,
    host: process.env.dbHost,
    database: process.env.dbName,
    password: process.env.dbPswd,
    port: process.env.port,
    ssl: true,
  },
  botToken: process.env.botToken,
  messages: {
    labsAmountMessage: 'Количество лабораторных работ в курсе:',
    testsAmountMessage: 'Количество контрольных работ в курсе:',
    labsAmountErrorMessage: '0 <= Количество лабораторных <= 10',
    testsAmountErrorMessage: '0 <= Количество контрольных <= 5',
    additionalMessage: 'Наличие дополнительных баллов: (y/n)',
    successCourseMessage: 'Курс добавлен',
    dismissMessage: 'Курс не добавлен',
    addGroupErrorMessage: 'Отсутствуют курсы для добавления групп',
    courseNameMessage: 'Задайте название курса:',
    groupListFormatMessage: `
    Пришлите список группы текстовым файлом в следующем формате

    ИМЯ ГРУППЫ
    Студент 1
    Студент 2
    ...`,
    teacherRegistredMessage: 'Вы зарегестрированы как преподаватель',
    studentsAddedMessage: 'Студенты добавлены',
    setMarkMessage: `
  Пришлите сообщение в таком формате: course_group_id/student name/task_num/mark`,
  markSettedMessage: 'Оценка добавлена!',
  },
};
