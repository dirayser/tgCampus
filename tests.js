'use strict';

const { Telegraf } = require('telegraf');
const { statusChanger } = require('./Bot/modules/status.module');

const statuses = statusChanger();
statuses.set('id001', 'expected');
console.assert('expected' === statuses.get('id001')); //1

console.assert(new Telegraf().telegram.options.apiMode === 'bot');