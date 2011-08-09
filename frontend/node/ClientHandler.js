require('mootools');
var enums = require('../lib/enums')


var ClientHandler = new Class({
	gameState : {},
	sockets: {},
	
	initialize : function(sockets) {
		// Fetch game state from db
		this.sockets = sockets;
		
		this.sockets.on('connection', this.addClient.bind(this));
	},
	
	addClient : function(client) {
		

		client.emit('stateUpdate',{
			entityType: enums.EntityTypes.Player,
			action: enums.Actions.New,
			data: 'lol'
		});
	}
	
});



module.exports = function(v) { return new ClientHandler(v); };