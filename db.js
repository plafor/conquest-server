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
    //console.log(db.get("teams").remove(db.get('teams').find({ name: "Green" }).value()).value());
    //console.log(db.get("teams").remove(db.get('teams').find({ name: "Red" }).value()).value());
    teamHandler.createTeam("Red",  -65536,0);
    teamHandler.createTeam("Green",  24611,1);
    /*teamHandler.addPlayer("Red", "Tristan");
    teamHandler.addPlayer("Red", "Charles");

    teamHandler.changePlayerScore("Tristan", 5);

    teamHandler.getPlayerList();

    /*db.get('spots').push({
        title: "Departement Informatique",
        lat: 48.086012,
        long: -0.759521,
        status: "Neutral"
    }).value();
    db.get('spots').push({
        title: "Parking",
        lat: 48.085445810389906,
        long: -0.7593280076980591,
        status: "Neutral"
    }).value();
    db.get('spots').push({
        title: "Dormerie",
        lat: 48.085093,
        long: -0.758780,
        status: "Neutral"
    }).value()*/
}
exports.newGame = newGame;