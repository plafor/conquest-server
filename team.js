/**
 * Created by charles on 07/01/2017.
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
const winston = require('winston');
/**
 * Internal Module dependencies.
 */
const spots = require('./spots');


function createTeam(name, color) {
    db.get('teams').find({ name: name }).assign({
        "name" : name,
        "color" : color,
        "players" : [],
        "score" : 0,
        "numberQuestionTried" : 0}).value();
}
exports.resetTeam = createTeam;

function addPlayer(teamName, player) {
    if(playerFinder(player)!=null) {
        winston.error("A Player have tried to choose an username that is already in database!");
        return "Neutral";
    }
    if(db.get('teams').find({ name: "Red" }).value().players.length > db.get('teams').find({ name: "Green" }).value().players.length) {
        db.get('teams').find({ name: "Green" }).assign(db.get('teams').find({ name: "Green" }).value().players.push({
            username: player,
            numberQuestionTried: 0,
            score : 0,
            lat : 0,
            long : 0
        })).value();
        return "Green";
    } else if(db.get('teams').find({ name: "Red" }).value().players.length < db.get('teams').find({ name: "Green" }).value().players.length) {
        db.get('teams').find({ name: "Red" }).assign(db.get('teams').find({ name: "Red" }).value().players.push({
            username: player,
            numberQuestionTried: 0,
            score : 0,
            lat : 0,
            long : 0
        })).value();
        return "Red";
    } else {
        db.get('teams').find({ name: teamName }).assign(db.get('teams').find({ name: teamName }).value().players.push({
            username: player,
            numberQuestionTried: 0,
            score : 0,
            lat : 0,
            long : 0
        })).value();
        return teamName;
    }
}
exports.addPlayer = addPlayer;

function answerToQuestion(playerUsername, result, title, spotTitle) {
    const teamName = playerTeamFinder(playerUsername).name;
    const team = db.get('teams').find({name: teamName}).value();
    const player = playerFinder(playerUsername);
    if(result) {
        team.score += 1;
        player.score += 1;
    }
    team.numberQuestionTried += 1;
    player.numberQuestionTried += 1;
    db.get('teams').find({name: teamName}).assign(team).value();
    spots.spotChangeStatus(spotTitle,team.name)
}
exports.answerToQuestion = answerToQuestion;

// Useless, Can be usefull later
function changePlayerScore(playerUsername, score) {
    const teamName = playerTeamFinder(playerUsername).name;
    const team =  db.get('teams').find({ name: teamName}).value();
    team.score += score;
    playerFinder(playerUsername).score += score;
    db.get('teams').find({ name: teamName}).assign(team).value();
}
exports.changePlayerScore = changePlayerScore;

function changePlayerPosition(playerUsername, lat, long) {
    const teamName = playerTeamFinder(playerUsername).name;
    const team =  db.get('teams').find({ name:teamName}).value();
    let player = _.find(team.players, function (player) {
        return player.username=playerUsername;
    });
    player.lat = lat;
    player.long= long;
    db.get('teams').find({ name: teamName}).assign(team).value();
}
exports.changePlayerPosition = changePlayerPosition;

function playerFinder(playerUsername) {
    let resultForEach=null;
    _.each(db.get('teams').value(), function (team) {
        const result =_.find(team.players, function (obj) {
            return playerUsername==obj.username;
        });
        if(result!=null)  {
            resultForEach=result;
        }
    });
    return resultForEach;
}


function playerTeamFinder(playerUsername) {
    let resultForEach=null;
    _.each(db.get('teams').value(), function (team) {
        const result =_.find(team.players, function (obj) {
            return playerUsername==obj.username;
        });
        if(result!=null)  {
            resultForEach=team;
        }
    });
    return resultForEach;
}

function getPlayerList() {
    let list = [];
    _.each(db.get('teams').value(),function (team) {
        _.each(team.players, function (player) {
            player.team= team.name
            list.push(player);
        })
    });
    //jsonfile.writeFileSync("./test.json",list, {spaces: 2});
    return list;
}
exports.getPlayerList = getPlayerList;

function getTeamList() {
    let list = [];
    _.each(db.get('teams').value(),function (team) {
        list.push(team);
    });
    //jsonfile.writeFileSync("./test.json",list, {spaces: 2});
    return list;
}
exports.getTeamList = getTeamList;