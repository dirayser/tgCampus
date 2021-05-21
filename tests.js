'use strict';

const { Telegraf } = require('telegraf');
const { statusChanger } = require('./Bot/modules/status.module');

const statuses = statusChanger();
statuses.set('id001', 'expected');
console.assert('expected' === statuses.get('id001')); //1
statuses.unset('id001');
console.assert(undefined === statuses.get('id001')); //2

console.assert(new Telegraf().telegram.options.apiMode === 'bot');