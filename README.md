# Telegram e-campus Bot 
Этот [бот](https://t.me/tgCampus_bot) предназначен для создания списка группы и отображения текущих баллов ее студентов. Пользователь может зарегистрироваться как преподаватель, добавив курс. Затем нужно отправить список группы, изучающей данный курс, в формате, указанным ботом. После этого преподаватель может добавлять оценки в список и запрашивать файл с ним.

# Контрибьютеры
* [Дмитриев Дмитрий](https://github.com/dirayser) [(telegram)](https://t.me/dirayser)
* [Заводовская Елизавета](https://github.com/zavad4) [(telegram)](https://t.me/zavad4)
* [Зегельман Марк](https://github.com/zemark-prog) [(telegram)](https://t.me/zemark_ua)

# API/Frameworks
* [Telegraf](https://telegraf.js.org/#/)
* [pg](https://www.npmjs.com/package/pg)
* [exceljs](https://www.npmjs.com/package/exceljs)
* [uid-generator](https://github.com/uuidjs/uuid)

# Как использовать бота
Сначала пользователю нужно зарегистироваться, как преподователь. Для этого достаточно добавить один курс, написав /add_course, после чего указать название курса. Затем бот запрашивает рассчитаное количество лабораторных и контрольных работ в курсе, наличие в нем дополнительных баллов.
Далее пользователь может присоеденять к этому курсу неограниченное количество групп коммандой /add_course. Регистрируя каждую группу, бот запрашивает список группы в таком формате: 
```
ИМЯ ГРУППЫ
    Студент 1
    Студент 2
    ...
```
После этих действий преподователь может добавлять оценки студентам и запрашивать excel-файл с баллами студентов группы.

# Установка
1. Клонируйте этот репозиторий
```
git clone https://github.com/dirayser/tgCampus
```
2. В файле ```config.js``` измените переменные таким образом: 
```
  user: <your_user>,
  host: <your_host>,
  database: <your_database>,
  password: <your_password>,
  port: <your_port>,
  botToken = <your_botToken>;
```
# Помощь
Задавайте вопросы в телеграм одному из [контрибьютеров](https://github.com/dirayser/tgCampus/blob/master/README.md#%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%B8%D0%B1%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D1%8B) или добавляйте issues в [репозиторий](https://github.com/dirayser/tgCampus) проэкта.
