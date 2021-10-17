const express = require('express');
const { fstat } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

app.get('/icon', function (req, res) {
  fs.readFile('res/dc.png', function (error, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

class Content {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

var contents = [];

sendContent = () => {
  var _ct = [];

  for (var i = 0; i < contents.length; i++) {
    var __ct = new Object();
    __ct.title = contents[i].title;
    __ct.content = contents[i].content;
    _ct.push(__ct);
  }
  io.emit('sendData', _ct);
}

io.on('connection', (socket) => {
  socket.on('init', () => {
    sendContent();
  });
  
  socket.on('write', (title, content) => {
    contents.push(new Content(title, content));
    
    sendContent();
  })

});

/*
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
*/