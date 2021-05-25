'use strict';

const { Telegraf } = require('telegraf');
const tgCampus = require('./modules/bot.module');
const config = require('../config');

const BOT_TOKEN = config.botToken;

const bot = new Telegraf(BOT_TOKEN, {
  polling: true,
});

bot.command('/add_group', tgCampus.onAddGroup);

bot.command('/add_course', tgCampus.onGetCourse);

bot.command('/get_list', tgCampus.onGetList);

bot.command('/set_mark', tgCampus.onSetMark);

bot.command('/delete_course', tgCampus.onDeleteCourse);

bot.on('document', tgCampus.onGotDocument);

bot.on('callback_query', tgCampus.onCBquery);

bot.on('text', tgCampus.onText);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));