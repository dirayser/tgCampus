'use strict';

const { Telegraf } = require('telegraf');
const { statusChanger } = require('./Bot/modules/status.module');

const statuses = statusChanger();

statuses.set('id001', 'expected');
console.assert(statuses.get('id001') === 'expected'); //1

statuses.set('id002', '');
console.assert(statuses.get('id002') === ''); //2

statuses.set('id002', 10);
console.assert(statuses.get('id002') === 10); //3

statuses.unset('id001');
console.assert(statuses.get('id001') === undefined); //4

console.assert(new Telegraf().telegram.options.apiMode === 'bot');