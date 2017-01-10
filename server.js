const app = require('express')();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);

const teamHandler = require('./team');
const dbUtil = require('./db');
//DataBase
const low = require('lowdb');
const fileSync = require('lowdb/lib/file-sync');
const db = low('db.json', {
    storage: fileSync
})
dbUtil.newGame();

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
// Set socket.io listeners.
socket.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('newPlayer', (message) => {
        const obj = JSON.parse(message);
        teamHandler.addPlayer(obj.nickname, obj.preferedTeam);
    });
    socket.on('message', (message) => {
        console.log(message);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
/*
socket.on('connection', function (message) {
    console.log('A new client is connected.' + message);
    socket.emit('information', 'Vous êtes bien connecté !');
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    });

    socket.on('answserQuestion', function (message) {
        console.log("answserQuestion", message);
    });
    socket.on('changePosition', function (message) {
        console.log("changePosition", message);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
socket.on('message', function (message) {
    console.log('Un client me parle ! Il me dit : ' + message);
});
*/
const port = process.env.PORT || 80;
server.listen(port, () => console.log('Express server listening on %d, in %s mode', port, app.get('env')));


/*teamHandler.createTeam("Red", 123456);
 teamHandler.addPlayer("Red",{
 "nickname" : "George",
 "team" : "Red",
 "score" : 0,
 "lat" : 0,
 "long" : 0
 });
 teamHandler.addPlayer("Red",{
 "nickname" : "Tizaki",
 "team" : "Red",
 "score" : 0,
 "lat" : 0,
 "long" : 0
 });
 teamHandler.changePlayerScore("Red","Tizaki",1);
 teamHandler.createTeam("Green", 456198);
 teamHandler.addPlayer("Green",{
 "nickname" : "Nvidiot",
 "team" : "Green",
 "score" : 0,
 "lat" : 0,
 "long" : 0
 });
 teamHandler.addPlayer("Green",{
 "nickname" : "Shittel",
 "team" : "Green",
 "score" : 0,
 "lat" : 0,
 "long" : 0
 });
 teamHandler.addPlayer("Green",{
 "nickname" : "GreenPeace",
 "team" : "Green",
 "score" : 0,
 "lat" : 0,
 "long" : 0
 });
 teamHandler.changePlayerPosition("Red", "George", 42, 32);*/
