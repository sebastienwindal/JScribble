
var assert = require('assert');
var express = require('express');
var server = require('../JScribbleServer');

var port = 5000;

server.start(port, 0.2);

exports.testAsync = function(beforeExit) {
    var io = require('socket.io-client');
    var socket = io.connect('http://localhost:' + port);

    assert(socket !== null);
    assert(socket !== undefined);    
    var wasConnected = false;    
    var timeout;
    socket.on('connect', function(err) {
        wasConnected = true;
        assert.isUndefined(err);

        // send the join message...
        socket.emit('join', JSON.stringify({ userName: 'testusername', userId: '1234', avatar: 'someImage.png' }));

        // disconnect if no answer in 1/2 sec.
        timeout = setTimeout(function() {
            server.stop();
            socket.disconnect();
        }, 1000);
    });

    var connectResponseRecvd = false;

    socket.on('chat', function(data) {
        connectResponseRecvd = true;
        clearTimeout(timeout);

        var msg = JSON.parse(data);
        assert(msg.action == 'control');
        assert(msg.userId = '1234');
        assert(msg.avatar == 'someImage.png');
        assert(msg.userName == 'testusername');

        server.stop();
        socket.disconnect();
    });

    beforeExit(function(){
        console.log("exit");
        socket.disconnect();
        assert(wasConnected, "socket.io never connected to server.");
        assert(connectResponseRecvd, "No response to connect message.")
    });
};

