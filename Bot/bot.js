'use strict';

const Telegraf = require('telegraf');
const tgCampus = require('./modules/bot.module');
const config = require('../config');

const BOT_TOKEN = config.botToken;

const bot = new Telegraf(BOT_TOKEN, {
  polling: true,
});

bot.command('/add_group', tgCampus.onAddGroup);

bot.command('/add_course', tgCampus.onGetCourse);

bot.command('/get_list', tgCampus.onGetList);

bot.on('document', async ctx => {
  const isWaited = tgCampus.isDocWaited(ctx);
  if (isWaited) tgCampus.onDocument(ctx);
});

bot.on('callback_query', tgCampus.onCBquery);

bot.on('text', tgCampus.onText);

bot.launch();
