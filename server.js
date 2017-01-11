/**
 * Created by charles on 09/01/2017.
 */

/**
 * External Module dependencies.
 */

const app = require('express')();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const winston = require('winston');
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
const dbUtil = require('./db');
// DataBase
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
const question = require('./question');

/**
 * GameCreating
 */

dbUtil.newGame();

/**
 * Express Route configuration
 */

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/web/index.html');
});

/**
 * Socket.io configuration
 */

socket.on('connection', (socket) => {
    winston.info('a user connected');
    socket.on('newPlayer', (message) => {
        const player = JSON.parse(message);
        winston.info('Creating user with username: '+player.username+' and team preference to '+player.teamName);
        teamHandler.addPlayer(player.teamName, player.username);
    });
    socket.on('changePosition', (message) => {
        const player = JSON.parse(message);
        winston.info('the player '+player.username+' changer this position to lat:'+player.lat+' and long: '+player.long);
        teamHandler.changePlayerPosition(player.username, player.lat, player.long);
    });
    socket.on('answerQuestion', (message) => {
        const questionResult = JSON.parse(message);
        winston.info('the player '+questionResult.username+' as anwsered to the question :'+questionResult.title+' and his result is '+questionResult.result);
        teamHandler.answerToQuestion(questionResult.username, questionResult.result);
    });
    socket.on('sendSpots', (message) => {
        socket.emit('sendSpots', spots.getSpotList());
    });
    socket.on('sendRandomQuestion', (message) => {
        socket.emit('sendRandomQuestion', question.getQuestionRandom());
    });
    socket.on('sendPlayerList', (message) => {
        socket.emit('sendPlayerList', teamHandler.getPlayerList());
    });
    socket.on('disconnect', () => {
        winston.info('a user disconnected');
    });
});

/**
 * Start listen with the server
 */
const port = process.env.PORT || 80;
server.listen(port, () => console.log('Express server listening on %d, in %s mode', port, app.get('env')));
