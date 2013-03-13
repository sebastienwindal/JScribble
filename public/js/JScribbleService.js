
app.factory('JScribbleService', function($rootScope) {

  	return {
  		socket: null,
  		userName: null,
  		userId: null,
      avatar: null,
      possibleAvatars: [
        "8ball.tif.jpg",
        "Baseball.tif.jpg",
        "Basketball.tif.jpg",
        "Bowling.tif.jpg",
        "Cactus.tif.jpg",
        "Chalk.tif.jpg",
        "Dahlia.tif.jpg",
        "Dandelion.tif.jpg",
        "Drum.tif.jpg",
        "Eagle.tif.jpg",
        "Earth.tif.jpg",
        "Flower.tif.jpg",
        "Football.tif.jpg",
        "Fortune Cookie.tif.jpg",
        "Gingerbread Man.tif.jpg",
        "Golf.tif.jpg",
        "Guitar.tif.jpg",
        "Hockey.tif.jpg",
        "Leaf.tif.jpg",
        "Lightning.tif.jpg",
        "Lotus.tif.jpg",
        "Medal.tif.jpg",
        "Nest.tif.jpg",
        "Owl.tif.jpg",
        "Parrot.tif.jpg",
        "Penguin.tif.jpg",
        "Piano.tif.jpg",
        "Poppy.tif.jpg",
        "Red Rose.tif.jpg",
        "Sandollar.tif.jpg",
        "Smack.tif.jpg",
        "Snowflake.tif.jpg",
        "Soccer.tif.jpg",
        "Sunflower.tif.jpg",
        "Target.tif.jpg",
        "Tennis.tif.jpg",
        "Turntable.tif.jpg",
        "Violin.tif.jpg",
        "Whiterose.tif.jpg",
        "Yellow Daisy.tif.jpg",
        "Ying Yang.tif.jpg",
        "Zebra.tif.jpg",
        "Zen.tif.jpg",
      ],
  		messages: [],

	  	init: function(host, userName, avatar) {

	  		this.socket = io.connect('http://' + host);
	  		this.socket.userData = this;
	  		this.userName = userName;
        this.avatar = avatar;
	  		this.userId = Math.floor((1 + Math.random()) * 0x10000).toString(16);
	  		this.socket.emit('join', $.toJSON({ userName: this.userName, userId: this.userId, avatar: this.avatar }));
	  		this.socket.on('chat', this.chatCallback, 'd');
	  	},

      logout: function() {
        this.userName = null;
        this.userId = null;
        this.messages = [];
        this.socket.disconnect();
      },

	    sendChatMessage: function(message) {
        
	    	var msg = $.toJSON({  action: 'message', 
                              userId: this.userId,
                              msg: message, 
                              userName: this.userName,
                              avatar: this.avatar
                              });
    		this.socket.emit('chat', msg);
	    },

	    chatCallback: function (msg, d) {

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
        }
    
  	}
});