/**
 * Created by charles on 10/01/2017.
 */

/**
 * External Module dependencies.
 */
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
const _ = require('lodash');

function getQuestion(title) {
    return db.get('question').find({ title: title }).value();
}
exports.getQuestion = getQuestion;

function getQuestionRandom() {
    return db.get('questions').value()[getRandom(0,db.get('questions').value().length-1)];
}
exports.getQuestionRandom = getQuestionRandom;

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
