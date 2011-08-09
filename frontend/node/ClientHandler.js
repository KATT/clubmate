require('mootools');
var enums = require('../lib/enums')

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
		var testX = 10;
		var testY = 10;
		//send sprite data
		client.emit('asset', {
			type: enums.AssetTypes.Sprite,
			url: 'playerOne.png',
			tileSize: 8,
			spriteMap: {
				playerOneSprite: [0, 1, 3, 3],
				socialSprite: [0, 5, 3, 3],
				policeSprite: [0, 9, 3, 3]
			}
		});
		client.emit('stateUpdate', {
			entityType: 'Player',
			action: 'New',
			data: {
				alias: 'Bjarne',
				x: testX,
				y: testY,
				components: 'playerOneSprite, animate, gameSprite',
				id: 'testPlayer1',
			}
		});
		//Get map chunk for player x & y
		client.emit('stateUpdate', {
			entityType: 'Map',
			action: 'New',
			data: {
				map: testMap,
				tileTypes: testTiles,
				tileSet: {
					url: 'tiles.png',
					tiles: {street: [0, 0],	fence: [0, 1], lawn: [0, 2], house: [0, 3, 1, 9]}
				},
				x: 0, //These coordinates are the position of the map relative to the player. 0:0 is thus always the one we're standing on at the moment.
				y: 0
			}
		});
		
	}
});



module.exports = function(v) { return new ClientHandler(v); };