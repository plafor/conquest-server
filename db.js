/**
 * Created by aytsukii on 10/01/2017.
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
/**
 * Internal Module dependencies.
 */
const teamHandler = require('./team');
const spots = require('./spots');


function newGame() {
    db.defaults({ teams: [] }).value();
    db.defaults({ spots: [] }).value();
    db.defaults({ questions: [] }).value();
    teamHandler.resetTeam("Red",  "#c62828");
    teamHandler.resetTeam("Green",  "#43a047");
    spots.resetSpots();

}
exports.newGame = newGame;