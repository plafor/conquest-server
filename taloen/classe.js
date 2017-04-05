/**
 * Classe is a file to verify if class give in query exist
 */
const _ = require('lodash');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', { storage: fileSync });
// Print console
const winston = require('winston');

function verifClass(dataClass) {
  let exist = false;

  _.each(db.value(), function (value, key) {
    if (key == dataClass) exist = true;
  });

  return exist;
}

function getValue(dataClass, dataKey) {
  if (typeof dataClass === 'undefined')
    return db.value();
  if (typeof dataKey === 'undefined')
    return db.get(dataClass).value();
  return db.get(dataClass).find({ name: dataKey}).value();
}

function setValue(dataClass, dataKey, value) {
  if (value.length == dataKey.length) {
    for (var i = 0; i < dataKey.length; i++) {
      for(var a in value) {
      //let dataChange = getValue(dataKey[i]);
      //dataChange.dataKey = value[i];
      //db.get(dataClass).find(getValue(dataKey)).assign(dataChange).value();
      }
    }
  } else {
    console.log("Error : nombre of values is different between value and title");
  }
}

function getValueUsed(dataClass, data, parameter, dataKey) {
  let list = [];
  if(typeof dataKey === 'undefined') {
    _.each(db.get(dataClass).value(), function (value, key) {
      list.push(transformJSON(value, data, parameter));
    });
  } else {
    _.each(db.get(dataClass).find({ name: dataKey }).value(), function (value, key) {
      list.push(transformJSON(value, data, parameter));
    });
  }

  return JSON.stringify(list);
}

function transformJSON(value, data, parameter) {
  // If parameter is true the values return is wanted values else is exclusion
  var result = [];

  for(var a in value) {
    for(var i = 0; i < data.length; i++) {
      if (parameter) {
        if(a == data[i])
          result.push(value [a]);
      }
      else {
        if(a != data[i])
          result.push(value [a]);
      }
    }
  }

  return result;
}

exports.getValue = getValue;
exports.verifClass = verifClass;
exports.getValueUsed = getValueUsed;
exports.setValue = setValue;

// Function to verify if a team win the game
function verifIfTeamWin() {
  let a = 0, b = 0, teamName = null;

  _.each(getValueUsed('team', ['']), function (value, key) {
    if (teamName == null) { teamName = value.status;}
    if (value.status == teamName) { b++; }
    a++;
  });

  return (a == b) ? c : "Neutral";
}

// Function to choose a random question
function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Getter of question
function getQuestionRandom() {
    return db.get('question').value()[getRandom(0, db.get('question').value().length - 1)];
}

function statement(index) {
	var value = classe.getValue('team');
	for (var i in value) {
		if (i == 0) {
			var spotValue = value[i].spot;
			for (var a in spotValue) {
				if (a == index)
				 return spotValue[a].state;
			}
		}
	}
}

exports.statement = statement;
exports.getQuestionRandom = getQuestionRandom;
exports.verifIfTeamWin = verifIfTeamWin;





/**
 *
 */






 // Function to change the status of the spot
 function spotChangeStatus(title, status) {
   const spotChange = getValueUsed('team', ['spot'], true, title);
   spotChange.status = status;
   db.get('spot').find(getValueUsed('team', ['spot'], true, title)).assign(spotChange).value();
 }
 exports.spotChangeStatus = spotChangeStatus;

 function setEndTime(endTime) {
   db.assign({ endTime : JSON.stringify(endTime) }).value();
 }
 exports.setEndTime = setEndTime;


function playerExists(player, ipAddress) {
  let dat = "";
  let dataA = getValue('team');
  for (var a in dataA) {
    let dataB = dataA[a];
    for (var b in dataB) {
      if (b == 'player') {
        let dataC = dataB[b];
        for (var c in dataC) {
          let dataD = dataC[c];
          for (var d in dataD) {
            if (dataD[d] == player) dat = player;
            if (dataD[d] == ipAddress && dat == player) return true;
          }
        }
      }
    }
  }
  return false;
}
 /**
  * Add player
  */
  function addPlayer(player, teamName, ipAddress) {
      if (playerExists(player, ipAddress)) return true;

      if(playerFinder(player)!=null) {
          winston.error("A Player have tried to choose an username that is already in database!");
          return false;
      }
      if(db.get('team').find({ name: "Red" }).value().player.length == db.get('team').find({ name: "Green" }).value().player.length) {
          db.get('team').find({ name: teamName }).assign(db.get('team').find({ name: teamName }).value().player.push({
              username: player,
              numberQuestionTried: 0,
              score : 0,
              latitude : 0,
              longitude : 0,
              ip: ipAddress
          })).value();
          return true;
      }
      if(db.get('team').find({ name: "Red" }).value().player.length > db.get('team').find({ name: "Green" }).value().player.length) {
          db.get('team').find({ name: "Green" }).assign(db.get('team').find({ name: "Green" }).value().player.push({
              username: player,
              numberQuestionTried: 0,
              score : 0,
              latitude : 0,
              longitude : 0,
              ip: ipAddress
          })).value();
          return true;
      } else if(db.get('team').find({ name: "Red" }).value().player.length < db.get('team').find({ name: "Green" }).value().player.length) {
          db.get('team').find({ name: "Red" }).assign(db.get('team').find({ name: "Red" }).value().player.push({
              username: player,
              numberQuestionTried: 0,
              score : 0,
              latitude : 0,
              longitude : 0,
              ip: ipAddress
          })).value();
          return true;
      } else {
          db.get('team').find({ name: teamName }).assign(db.get('team').find({ name: teamName }).value().player.push({
              username: player,
              numberQuestionTried: 0,
              score : 0,
              latitude : 0,
              longitude : 0,
              ip: ipAddress
          })).value();
          return true;
      }
      winston.error("Aucun if de addPlayer n'a pu supporter les argument en entree");
      return false;
  }
  exports.addPlayer = addPlayer;

  function answerToQuestion(playerUsername, result, title, spotTitle) {
      const teamName = playerTeamFinder(playerUsername).name;
      const team = db.get('team').find({name: teamName}).value();
      const player = playerFinder(playerUsername);
      if(result) {
          team.score += 1;
          player.score += 1;
      }
      team.numberQuestionTried += 1;
      player.numberQuestionTried += 1;
      db.get('team').find({name: teamName}).assign(team).value();
      spotChangeStatus(spotTitle,team.name)
  }
  exports.answerToQuestion = answerToQuestion;

  // Useless, Can be usefull latitudeer
  function changeplayercore(playerUsername, score) {
      const teamName = playerTeamFinder(playerUsername).name;
      const team =  db.get('team').find({ name: teamName}).value();
      team.score += score;
      playerFinder(playerUsername).score += score;
      db.get('team').find({ name: teamName}).assign(team).value();
  }
  exports.changeplayercore = changeplayercore;

  function changePlayerPosition(playerUsername, latitude, longitude) {
      const teamName = playerTeamFinder(playerUsername).name;
      const team =  db.get('team').find({ name:teamName}).value();
      let player = _.find(team.player, function (player) {
          return player.username=playerUsername;
      });
      player.latitude = latitude;
      player.longitude= longitude;
      db.get('team').find({ name: teamName}).assign(team).value();
  }
  exports.changePlayerPosition = changePlayerPosition;

  function playerFinder(playerUsername) {
      let resultForEach=null;
      _.each(db.get('team').value(), function (team) {
          const result =_.find(team.player, function (obj) {
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
      _.each(db.get('team').value(), function (team) {
          const result =_.find(team.player, function (obj) {
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

      _.each(db.get('team').value(),function (team) {
          _.each(team.player, function (player) {
              list.push(player);
          })
      });

      return list;
  }
  exports.getPlayerList = getPlayerList;
