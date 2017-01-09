const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const teamHandler = require('./team');

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function(req, res,next) {
  //  res.sendFile(__dirname + '/index.html');
    res.send('Hello World!');
});
server.listen(80, function () {
  console.log('Server start with port 80!');
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

socket.on('connection', function(){
  console.log('A new client is connected.');
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
