/**
 * Created by charles on 10/01/2017.
 */

const jsonfile = require('jsonfile');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
const _ = require('lodash');
db.defaults({ questions: [] }).value();

function getQuestion(title) {
    return db.get('question').find({ title: title }).value();
}
exports.getQuestion = getQuestion;

function getQuestionRandom() {
    return db.get('question').value()[getRandom(0,db.get('question').value().length-1)];
}
exports.getQuestionRandom = getQuestionRandom;

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
