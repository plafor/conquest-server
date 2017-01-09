const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const teamHandler = require('./utils/team');


app.use(express.static(__dirname + '/semantic/dist'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

socket.on('connection', function(message){
  console.log('A new client is connected.'+message);
  setInterval(() => socket.emit('time', new Date().toTimeString()), 1000);
  socket.on('disconnect', () => console.log('Client disconnected'));
});
socket.on('message', function(message){
  console.log(message);
});
socket.on('newPlayer', function (message) {
  console.log("newPlayer", message);
});
socket.on('answserQuestion', function (message) {
  console.log("answserQuestion", message);
});
socket.on('changePosition', function (message) {
  console.log("changePosition", message);
});

const port = process.env.PORT || 8080;
server.listen(port, function () {
 console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});


teamHandler.createTeam("Red", 123456);
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
teamHandler.changePlayerPosition("Red", "George", 42, 32);
