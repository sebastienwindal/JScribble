
var _ = require('underscore');

module.exports = {
    start: function(port) {
        var io = require('socket.io').listen(port);

        var messages = [];

        // Heroku won't actually allow us to use WebSockets
        // so we have to setup polling instead.
        // https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
        io.configure(function () {
          io.set("transports", ["xhr-polling"]);
          io.set("polling duration", 10);
        });

        io.sockets.on('connection', function (socket) { // handler for incoming connections
            
            socket.on('chat', function (data) {
              var msg = JSON.parse(data);
              msg.time = new Date();
              var reply = JSON.stringify( { action: msg.action, 
                                            userId: msg.userId, 
                                            msg: msg.msg,
                                            userName: msg.userName, 
                                            time: msg.time,
                                            avatar: msg.avatar
                                          });
              socket.emit('chat', reply);
              socket.broadcast.emit('chat', reply);
              messages.push(msg);
              var now = new Date();
              messages = _.reject(messages, function(m) {
                return (now - m.time) > (10 * 60 * 1000); // 10 minutes
              });

            });
            
            socket.on('draw', function (data) {
              var msg = JSON.parse(data);
              var reply = JSON.stringify( { action: msg.action,
                                            userId: msg.userId,
                                            start: msg.start,
                                            end: msg.end,
                                            color: msg.color,
                                            stroke: msg.stroke 
                                          });
              socket.broadcast.emit('draw', reply);
            });

            socket.on('join', function(data) {

              var msg = JSON.parse(data);
              var reply = JSON.stringify( { action: 'control', 
                                            userId: msg.userId, 
                                            avatar: msg.avatar,
                                            userName: msg.userName,
                                            msg: 'joined the channel',
                                            messages: _.first(messages, 50) });
              socket.emit('chat', reply);
            });

            socket.on('close', function(data) {
              var msg= JSON.parse(data);
              socket.disconnect();
            });
          });
            }
        };


