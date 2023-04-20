'use strict';

/* -- Requires -- */
/* -------------------------------------------------------------------------------------- */
const express = require('express');
const app     = express();
const serv    = require('http').Server(app);
const io      = require('socket.io')(serv, { pingTimeout: 30000 });

/* -- Variables -- */
/* -------------------------------------------------------------------------------------- */
global.debugMode = false;
let SOCKET_LIST = {},
    PING_LIST = {},
    pingCounter = 0,
    connectedScreens = 0;

/* -- Routing -- */
/* -------------------------------------------------------------------------------------- */
app.use(express.static(__dirname + '/public'));
app.get('/dev',         function(req, res) { res.sendFile('./public/pages/test-screens.html', { root: __dirname }); });
app.get('/touchscreen', function(req, res) { res.sendFile('./public/touchscreen.html', { root: __dirname }); });
app.get('/display',     function(req, res) { res.sendFile('./public/display.html', { root: __dirname }); });

/* -- Start server -- */
/* -------------------------------------------------------------------------------------- */
serv.listen(3000);
console.log(' ');
console.log('--== Server started ==--');
console.log('Open http://localhost:3000/dev to monitor screens');
console.log('Open http://localhost:3000/touchscreen for main touchscreen');
console.log('Open http://localhost:3000/display for display');


/* -- Basic functions -- */
/* -------------------------------------------------------------------------------------- */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function Interval(func, duration) {
  this.func = func;
  this.duration = duration;
  this.run();
};
Interval.prototype.run = function() {
  if (typeof this.baseline === "undefined") { this.baseline = +new Date(); }
  this.func.call(global);
  this.baseline += this.duration;
  let nextTick = this.duration + this.baseline - new Date();
  if (nextTick < 0) nextTick = 0;
  (function(i) { i.timer = setTimeout(function() { i.run(); }, nextTick); }(this));
};
Interval.prototype.stop = function(){
  clearTimeout(this.timer);
}


/* -- Touchscreen -- */
/* -------------------------------------------------------------------------------------- */
global.Touchscreen = function(id) {
  let self = { id: id }
  Touchscreen.list[id] = self;
  return self;
};

Touchscreen.list = {};

Touchscreen.onConnect = function(socket) {
  console.log('=[ Touchscreen connected          '+socket.id);
  connectedScreens++;
  Touchscreen.update();

  // Touchscreen clicks hi button
  socket.on('jaapClicked', function(data) {
    console.log(`${socket.id} has clicked JAAP!`);
  });

};

Touchscreen.update = function(sectionPack = false) {
  let updatePack = {
    debugMode: debugMode,
  };
  for (let i in Touchscreen.list) {
    SOCKET_LIST[Touchscreen.list[i].id].emit('update', updatePack);
  }
};

Touchscreen.onDisconnect = function(socket) {
  console.log(`=] Touchscreen disconnected       ${socket.id}`);
  delete Touchscreen.list[socket.id];
  connectedScreens--;
};


/* -- Display -- */
/* -------------------------------------------------------------------------------------- */
global.Display = function(id) {
  let self = { id: id }
  Display.list[id] = self;
  return self;
};

Display.list = {};

Display.onConnect = function(socket) {
  console.log('=[ Display connected              '+socket.id);
  connectedScreens++;

  // Add emission catchers here

};

Display.update = function() {
  let updatePack = {
    debugMode: debugMode,
  };
  for (let i in Display.list) {
    SOCKET_LIST[Display.list[i].id].emit('update', updatePack);
  }
};

Display.onDisconnect = function(socket) {
  console.log(`=] Display disconnected           ${socket.id}`);
  delete Display.list[socket.id];
  connectedScreens--;
};


/* -- Common code -- */
/* -------------------------------------------------------------------------------------- */
global.updateAll = function() {
  Touchscreen.update();
  Display.update();
}


/* -- Socket code -- */
/* -------------------------------------------------------------------------------------- */
io.sockets.on('connection', function(socket) {
  socket.id = uuidv4();
  socket.type = 'unknown';
  SOCKET_LIST[socket.id] = socket;

  // console.log('===[ Client connected:       '+socket.id);

  // Pong
  PING_LIST[socket.id] = {};
  PING_LIST[socket.id].missedPings = 0;
  PING_LIST[socket.id].identified = false;
  socket.on('pong', function(data) {
    // console.log(`Check if ${socket.id} pCount ${data.pCount} matches pingCounter ${pingCounter}`);
    if (data.pCount == pingCounter) { PING_LIST[socket.id].missedPings = 0; }
  });

  // Identify client type
  socket.on('identify', function(data) {

    // console.log('===[ Send initialData:       '+socket.id);
    socket.emit('initialData', { clientId: socket.id });

    // console.log('===[ Client identified, ping '+socket.id);
    PING_LIST[socket.id].identified = true;

    switch(data.type) {
      case 'touchscreen':
        socket.type = 'touchscreen';
        Touchscreen(socket.id);
        Touchscreen.onConnect(socket);
        break;
      case 'display':
        socket.type = 'display';
        Display(socket.id);
        Display.onConnect(socket);
        break;
      default:
        console.log('Unknown type...');
        break;
    }

  });

  socket.on('disconnect', reason => {
    if (socket.type == 'touchscreen') { Touchscreen.onDisconnect(socket); }
    if (socket.type == 'display') { Display.onDisconnect(socket); }
    console.log(`=X Disconnect reason: ${reason}`);
    delete SOCKET_LIST[socket.id];
    delete PING_LIST[socket.id];
  });

});


/* -- Ping loop -- */
/* -------------------------------------------------------------------------------------- */
let ping = setInterval(function() {
  pingCounter++;
  for (let i in PING_LIST) {
    if (PING_LIST[i].identified == true) {
      if (PING_LIST[i].missedPings > 0) {
        console.log('=! Client ping mismatch ('+PING_LIST[i].missedPings+')  '+i);
        if (PING_LIST[i].missedPings > 2) {
          console.log('=X Client ping lost          '+i);
          delete PING_LIST[i];
          SOCKET_LIST[i].disconnect();
        }
      } else {
        // console.log('=~ Client lives              '+i);
        PING_LIST[i].missedPings++;
        SOCKET_LIST[i].emit('ping', { pingCounter: pingCounter });
      }
    }
  }
}, 2000);


/* -- Session loop -- */
/* -------------------------------------------------------------------------------------- */
let sessionLoop = new Interval(function() {

  // if (sectionPack.updatePack.screenPack) { Touchscreen.update(sectionPack.updatePack.screenPack); }
  // if (sectionPack.updatePack.screenPack) { Display.update(sectionPack.updatePack.screenPack); }

}, 1000/60);