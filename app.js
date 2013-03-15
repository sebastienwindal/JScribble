var express = require('express'),
    app = express.createServer(express.logger()),
    io = require('socket.io').listen(app),
    routes = require('./routes');

var _ = require('underscore');

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

// Routes

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

app.get('/', routes.index);

var status = "All is well.";

var messages = [];

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