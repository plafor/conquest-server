/**
 * Created by charles on 07/01/2017.
 */
const jsonfile = require('jsonfile');

let teamList = [];

function createTeam(name, color) {
   teamList.push( {
       "name" : name,
       "color" : color,
       "players" : [],
       "score" : 0,
       "numberQuestionTried" : 0
   });
   updateJson();
}
exports.createTeam = createTeam;

function addPlayer(teamName, player) {
    getTeam(teamName).players.push(player);
    updateJson();
}
exports.addPlayer = addPlayer;

function changePlayerScore(teamName, playerNickname, score) {
    const team = getTeam(teamName);
    team.score = team.score + score;
    getPlayerInTeam(team, playerNickname).score = score;
    updateJson();
}
exports.changePlayerScore = changePlayerScore;

function changePlayerPosition(teamName, playerNickname, lat, long) {
    const player =  getPlayer(teamName, playerNickname);
    player.lat = lat;
    player.long= long;
    updateJson();
}
exports.changePlayerPosition = changePlayerPosition;

function getTeam(teamName) {
    function teamFinder(element) {
        return element.name == teamName;
    }
    return teamList.find(teamFinder);
}

function getPlayer(teamName, playerNickname) {
    function playerFinder(element) {
        return element.nickname == playerNickname;
    }
    return getTeam(teamName).players.find(playerFinder);
}

function getPlayerInTeam(team, playerNickname) {
    function playerFinder(element) {
        return element.nickname == playerNickname;
    }
    return team.players.find(playerFinder);
}

function updateJson() {
    jsonfile.writeFile("./src/res/data/teams.json", teamList, {spaces: 2}, function(err) {
        console.error("Error with JSON Update : "+err);
    })
}
