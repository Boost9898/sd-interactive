const socket = io();

function fLog(message, color) {
  if (typeof(color)==='undefined') { color = 'blue'; }
  console.log('%c'+message, 'color: '+color);
}

/* Socket: ping */
let alive = true;
let missedPings = 0;
socket.on('ping', function(data) {
  alive = true;
  socket.emit('pong', { pCount: data.pingCounter });
});
setInterval(function() {
  if (alive == false) {
    missedPings++;
    // fLog('Missed ping! ('+missedPings+')');
    if (missedPings > 6) {
      fLog('Too many missed pings, refreshing '+window.location.href);
      location.reload();
    }
  } else {
    missedPings = 0;
  }
  alive = false;
}, 3000);

/* Socket: disconnect */
socket.on('disconnect', function () {
  fLog('Server connection lost! Refreshing...', 'red');
  location.reload();
});

/* Socket: reboot */
socket.on('reboot', function() {
  fLog('Server rebooting...', 'red');
});