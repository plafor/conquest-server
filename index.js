/**
 * index.js is the creation of server to communicate with socket.io
 */

/**
 * External Module dependencies.
 */
// Create the serve and the socket connection
const app = require('express')();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
// Print console
const winston = require('winston');
// Log file
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'log/filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'log/filelog-error.log',
      level: 'error'
    })
  ]
});

/**
 * Internal Module dependencies.
 */
// Database taloen
const taloen = require('./taloen/taloen');
const classe = require('./taloen/classe');

/**
 * GameCreating
 */
// Initialization
const init = require('./initialize')
init.newGame();
let isTimerCreated = false;
let endTimer;

/**
 * Express Route configuration
 */
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/web/');
});

/**
 * Socket.io configuration
 */
socket.on('connection', (socket) => {
    winston.info('A user connected');

    // Socket to verif connexion
    socket.on('isAlive', (message) => {
      if (message == "alan") socket.emit('isAlive', "turing");
    });

    // Getter and setter to db connexion
    socket.on('getData', (message) => {
      winston.info('JSON: ' + JSON.stringify(classe.getValue()));
    	socket.emit('getData', taloen.getData(message));
    });

    // Socket to add a new Player in
    socket.on('newPlayer', (message) => {
      winston.info("New player with username: '" + JSON.parse(message).username + "' and preferedTeam: '" + JSON.parse(message).preferedTeam + "'");
    	socket.emit('newPlayer', classe.addPlayer(JSON.parse(message).username, JSON.parse(message).preferedTeam, socket.request.connection.remoteAddress));

      if (classe.getPlayerList().length == 2 && classe.getValue('endTime') == "") {
        dateEndGame = new Date(new Date().getTime() + 240000);

        classe.setEndTime(dateEndGame);
        winston.info('Sending startGame with date end game: ' + dateEndGame);

        socket.broadcast.emit('startGame', JSON.stringify(new Date()) + taloen.getData('{endTime}'));
        socket.emit('startGame', JSON.stringify(new Date()) + classe.getValue('endTime'));

        setInterval(function() {
          winston.info('Broadcast update to clients, cause : state change');
          socket.emit('update', "update");
          socket.broadcast.emit('update', "update");
        }, 3000, 3000 );
      }
    });

    // Socket to change the player position with latitude and longitude
    socket.on('changePosition', (message) => {
      const player = JSON.parse(JSON.stringify(message));
      winston.info('The player ' + player.username + ' changer this position to lat:' + player.latitude + ' and long: '+ player.longitude);
      classe.changePlayerPosition(player.username, player.latitude, player.longitude);
    });

    // Socket if the player answer to question
    socket.on('answerQuestion', (message) => {
      const questionResult = JSON.parse(JSON.stringify(message));
      winston.info('the player ' + questionResult.username + ' as answered to the question : ' + questionResult.title + 'at spot name: ' + questionResult.spotname + ' and his result is ' + questionResult.result);
      classe.answerToQuestion(questionResult.username, questionResult.result, questionResult.title, questionResult.spotName);
      winston.info('Broadcast update to client, cause : a player answered a question');

      const winnerTeam = classe.verifIfTeamWin();
      if(winnerTeam != "Neutral") {
        endGame();
      }

	    socket.broadcast.emit('update', "update");
    });

    socket.on('possibleEnd', (message) => {
      winston.info('Socket received: Possible end');
      if (!isTimerCreated) {
        endTimer = setInterval(function() {
          if (new Date(JSON.parse(classe.getValue('endTime'))).getTime() <= new Date().getTime()) {
            endGame();
            clearInterval(endTimer);
          }
        }, 0, 3000 );
      }
    });

    // If the player end the game
    socket.on('disconnect', () => {
        winston.info('A user disconnected');
    });
});

function endGame() {
  winston.info('update', "update, cause : team " + winnerTeam + " won the game!");
  socket.emit();
  socket.broadcast.emit('gamefinish', winnerTeam);
}

/**
 * Start listen with the server
 */
const port = process.env.PORT || 80;
server.listen(port, () => console.log('Express server listening on %d, in %s mode', port, app.get('env')));
