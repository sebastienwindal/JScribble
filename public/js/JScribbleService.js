
app.factory('JScribbleService', function($rootScope) {

  	return {
  		socket: null,
  		userName: null,
  		userId: null,
      avatar: null,
      possibleAvatars: [
        { image: "8ball.tif.jpg", isSelected: false },
        { image: "Baseball.tif.jpg", isSelected: false },
        { image: "Basketball.tif.jpg", isSelected: false },
        { image: "Bowling.tif.jpg", isSelected: false },
        { image: "Cactus.tif.jpg", isSelected: false },
        { image: "Chalk.tif.jpg", isSelected: false },
        { image: "Dahlia.tif.jpg", isSelected: false },
        { image: "Dandelion.tif.jpg", isSelected: false },
        { image: "Drum.tif.jpg", isSelected: false },
        { image: "Eagle.tif.jpg", isSelected: false },
        { image: "Earth.tif.jpg", isSelected: false },
        { image: "Flower.tif.jpg", isSelected: false },
        { image: "Football.tif.jpg", isSelected: false },
        { image: "Fortune Cookie.tif.jpg", isSelected: false },
        { image: "Gingerbread Man.tif.jpg", isSelected: false },
        { image: "Golf.tif.jpg", isSelected: false },
        { image: "Guitar.tif.jpg", isSelected: false },
        { image: "Hockey.tif.jpg", isSelected: false },
        { image: "Leaf.tif.jpg", isSelected: false },
        { image: "Lightning.tif.jpg", isSelected: false },
        { image: "Lotus.tif.jpg", isSelected: false },
        { image: "Medal.tif.jpg", isSelected: false },
        { image: "Nest.tif.jpg", isSelected: false },
        { image: "Owl.tif.jpg", isSelected: false },
        { image: "Parrot.tif.jpg", isSelected: false },
        { image: "Penguin.tif.jpg", isSelected: false },
        { image: "Piano.tif.jpg", isSelected: false },
        { image: "Poppy.tif.jpg", isSelected: false },
        { image: "Red Rose.tif.jpg", isSelected: false },
        { image: "Sandollar.tif.jpg", isSelected: false },
        { image: "Smack.tif.jpg", isSelected: false },
        { image: "Snowflake.tif.jpg", isSelected: false },
        { image: "Soccer.tif.jpg", isSelected: false },
        { image: "Sunflower.tif.jpg", isSelected: false },
        { image: "Target.tif.jpg", isSelected: false },
        { image: "Tennis.tif.jpg", isSelected: false },
        { image: "Turntable.tif.jpg", isSelected: false },
        { image: "Violin.tif.jpg", isSelected: false },
        { image: "Whiterose.tif.jpg", isSelected: false },
        { image: "Yellow Daisy.tif.jpg", isSelected: false },
        { image: "Ying Yang.tif.jpg", isSelected: false },
        { image: "Zebra.tif.jpg", isSelected: false },
        { image: "Zen.tif.jpg", isSelected: false },
      ],
      possibleColors: [ {color:'black', isSelected: true},
                        {color:'#fce94f', isSelected: false},
                        {color:'#edd400', isSelected: false},
                        {color:'#c4a000', isSelected: false},
                        {color:'#fcaf3e', isSelected: false},
                        {color:'#f57900', isSelected: false},
                        {color:'#ce5c00', isSelected: false},
                        {color:'#e9b96e', isSelected: false},
                        {color:'#c17d11', isSelected: false},
                        {color:'#8f5902', isSelected: false},
                        {color:'#8ae234', isSelected: false},
                        {color:'#73d216', isSelected: false},
                        {color:'#4e9a06', isSelected: false},
                        {color:'#729fcf', isSelected: false},
                        {color:'#3465a4', isSelected: false},
                        {color:'#204a87', isSelected: false},
                        {color:'#ad7fa8', isSelected: false},
                        {color:'#75507b', isSelected: false},
                        {color:'#5c3566', isSelected: false},
                        {color:'#ef2929', isSelected: false},
                        {color:'#cc0000', isSelected: false},
                        {color:'#a40000', isSelected: false},
                        {color:'#d3d7cf', isSelected: false},
                        {color:'#babdb6', isSelected: false},
                        {color:'#888a85', isSelected: false},
                        {color:'#555753', isSelected: false},
                        {color:'#2e3436', isSelected: false}
                      ],
  		messages: [],

	  	init: function(host, userName, avatar) {

        this.userName = userName;
        this.avatar = avatar;
        this.userId = Math.floor((1 + Math.random()) * 0x10000).toString(16) + 
                          Math.floor((1 + Math.random()) * 0x10000).toString(16);
                          
        if (this.socket) {
          if (this.socket.socket.connected === false &&
              this.socket.socket.connecting === false) {
                this.socket.socket.connect();
          }
          this.socket.emit('chatListPlease');
        } else {
	  		  this.socket = io.connect('http://' + host);
          this.socket.userData = this;
          this.socket.on('chat', this.chatCallback);
          this.socket.on('draw', this.drawCallback);

          this.socket.emit('join', $.toJSON({ userName: this.userName, userId: this.userId, avatar: this.avatar.image }));
        }
          
	  	}, 

      logout: function() {
        this.socket.emit('close', $.toJSON({ userName: this.userName, userId: this.userId}));
        this.userName = null;
        this.userId = null;
        this.avatar = null;
        this.messages = [];
        this.socket.socket.disconnect();
        //this.socket = null;
      },

	    sendChatMessage: function(message) {
        
	    	var msg = $.toJSON({  action: 'message', 
                              userId: this.userId,
                              msg: message, 
                              userName: this.userName,
                              avatar: this.avatar.image
                              });
    		this.socket.emit('chat', msg);
	    },

      setAvatar: function(av) {
        this.avatar = av;
      },

	    chatCallback: function (msg) {
      	var message = $.evalJSON(msg);

      	var action = message.action;
      	switch (action) {
          	case 'message':
              	this.userData.messages.push(message);
              	$rootScope.$apply();
          	break;
          
          	case 'control':
              if(message.messages && message.messages.length > 0) {
                this.userData.messages = message.messages;
                $rootScope.$apply();
              }
          	break;
          }
      },

      drawCallback: function(msg) {
        var message = $.evalJSON(msg);

        if (message.userId == this.userId) {
          // ignore our own messages being retransmitted back to us...
          return;
        }
        // send a notification message...
        $rootScope.$broadcast('remoteDraw', message);

      },

      addDrawSegment: function(start, end, color, stroke) {
        this.socket.emit('draw', $.toJSON({ action: 'draw', 
                                            userId: this.userId, 
                                            start: start, 
                                            end: end, 
                                            color: color,
                                            stroke: stroke }));
      },

      sendStartDraw: function(start, color, stroke) {
        this.socket.emit("");
        this.socket.emit('draw', $.toJSON({ action: 'start',
                                            userId: this.userId,
                                            start: start,
                                            end: start,
                                            color: color,
                                            stroke: stroke }));
      }
    
  	}
});