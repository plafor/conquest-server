/**
 * Created by charles on 07/01/2017.
 */
const jsonfile = require('jsonfile');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
const _ = require('lodash');
db.defaults({ teams: [] }).value();

function createTeam(name, color) {
    db.get('teams').find({ name: name }).assign({
        "name" : name,
        "color" : color,
        "players" : [],
        "score" : 0,
        "numberQuestionTried" : 0}).value();
}
exports.createTeam = createTeam;

function addPlayer(teamName, player) {
    if(db.get('teams').find({ name: "Red" }).value().players.length > db.get('teams').find({ name: "Green" }).value().players.length) {
        db.get('teams').find({ name: "Green" }).assign(db.get('teams').find({ name: "Green" }).value().players.push({
            nickname: player,
            score : 0,
            lat : 0,
            long : 0
        })).value();
    } else if(db.get('teams').find({ name: "Red" }).value().players.length < db.get('teams').find({ name: "Green" }).value().players.length) {
        db.get('teams').find({ name: "Green" }).assign(db.get('teams').find({ name: "Red" }).value().players.push({
            nickname: player,
            score : 0,
            lat : 0,
            long : 0
        })).value();
    } else {
        db.get('teams').find({ name: "Green" }).assign(db.get('teams').find({ name: teamName }).value().players.push({
            nickname: player,
            score : 0,
            lat : 0,
            long : 0
        })).value();
    }
}
exports.addPlayer = addPlayer;

function changePlayerScore(teamName, playerNickname, score) {
    const team =  db.get('teams').find({ name: teamName}).value();
    team.score += score;
    console.log(playerFinder(playerNickname));//.score += score;
    db.get('teams').find({ name: teamName}).assign(team).value();
}
exports.changePlayerScore = changePlayerScore;

function changePlayerPosition(teamName, playerNickname, lat, long) {
    const player =  playerFinder(playerNickname);
    player.lat = lat;
    player.long= long;
    db.get('teams').find({ name: teamName}).assign(team).value();
}
exports.changePlayerPosition = changePlayerPosition;

function playerFinder(playerNickname) {
    _.each(db.get("teams").value(), function (value, key) {
        _.each(value, function (value, key) {
            if(value.nickname == playerNickname) {return value}
        })
    });
    //_.each(db.get("teams").value(), (players, key) => _.each(players, (player, key) => {if(player.nickname == playerNickname) {return player}}));
}
