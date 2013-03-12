
app.factory('JScribbleService', function($rootScope) {

  	return {
  		socket: null,
  		userName: null,
  		userId: null,
  		messages: [],

	  	init: function(host, userName) {
	  		this.socket = io.connect('http://' + host);
	  		this.socket.userData = this;
	  		this.userName = userName;
	  		this.userId = Math.floor((1 + Math.random()) * 0x10000).toString(16);
	  		this.socket.emit('join', $.toJSON({ userName: this.userName, userId: this.userId }));
	  		this.socket.on('chat', this.chatCallback, 'd');

	  	},

      logout: function() {
        this.userName = null;
        this.userId = null;
        this.messages = [];
        this.socket.disconnect();
      },

	    sendChatMessage: function(message) {

	    	var msg = $.toJSON({   	action: 'message', 
                                    userId: self.userId,
                                    msg: message 
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
            	break;
            }
        }
    
  	}
});