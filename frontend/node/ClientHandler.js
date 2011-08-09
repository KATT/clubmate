require('mootools');


var testMap = {
	tiles: [
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
		0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	x: 0,
	y: 0,
	width: 20,
	height: 14
};

var testTiles = ['street', 'fence', 'lawn', 'house'];

var ClientHandler = new Class({
	gameState : {},
	sockets: {},
	
	initialize : function(sockets) {
		// Fetch game state from db
		this.sockets = sockets;
		
		this.sockets.on('connection', this.addClient.bind(this));
	},
	
	addClient : function(client) {
		var testX = 0;
		var testY = 0;
	
		client.emit('stateUpdate',{
			entityType: 'Player',
			action: 'New',
			data: {
				alias: 'Bjarne',
				x: testX,
				y: testY
			}
		});
		//Get map chunk for player x & y
		client.emit('stateUpdate',{
			entityType: 'Map',
			action: 'New',
			data: {
				map: testMap,
				tileTypes: testTiles,
				x: 0, //These coordinates are the position of the map relative to the player. 0:0 is thus always the one we're standing on at the moment.
				y: 0
			}
		});
		
	}
});



module.exports = function(v) { return new ClientHandler(v); };