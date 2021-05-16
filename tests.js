'use strict';

const { Telegraf } = require('telegraf');

console.assert(new Telegraf().telegram.options.apiMode === 'bot');
