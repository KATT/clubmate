require('mootools');


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
			entityType: 'Player',
			action: 'New',
			data: {alias: 'Bjarne'}
		});
	}
	
});



module.exports = function(v) { return new ClientHandler(v); };