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

statuses.set(2, 5);
console.assert(statuses.get(2) === 5); //4

statuses.set('id003');
console.assert(statuses.get('id003') === undefined) //5

console.assert(statuses.get('id000') === undefined); //6

statuses.unset('id001');
console.assert(statuses.get('id001') === undefined); //7

statuses.unset('id001');
console.assert(statuses.get('id001') === undefined); //8

console.assert(new Telegraf().telegram.options.apiMode === 'bot');