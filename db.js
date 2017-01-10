/**
 * Created by aytsukii on 10/01/2017.
 */
//Team
const teamHandler = require('./team');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})

function newGame() {
    db.defaults({ teams: [] }).value();
    db.defaults({ spots: [] }).value();
    //console.log(db.get("teams").remove(db.get('teams').find({ name: "Green" }).value()).value());
    //console.log(db.get("teams").remove(db.get('teams').find({ name: "Red" }).value()).value());
    teamHandler.createTeam("Red",  -65536,0);
    teamHandler.createTeam("Green",  -65536,1);

    teamHandler.addPlayer()
}
exports.newGame = newGame;