require('mootools');
var enums = require('../lib/enums')
///// TEST DATA START ///// 
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

var testX = 10;
var testY = 10;
var testPlayer = {
	id: 'testPlayer1',
	alias: 'Bjarne',
	x: testX,
	y: testY,
	components: 'playerOneSprite, animate, gameSprite'
};

/// TEST DATA END ///

 
var ClientHandler = new Class({
	testPlayer: {},
	gameState : {},
	sockets: {},
	
	initialize : function(sockets) {
		// Fetch game state from db
		this.sockets = sockets;
		this.testPlayer = testPlayer;
		this.sockets.on('connection', this.addClient.bind(this));
	},
	
	addClient : function(client) {
		client.set('token', 'test');
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
			data: this.testPlayer
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
		client.on('movePlayer', this.movePlayer.bind(this));
		
	},
	
	movePlayer: function(response) {
		//TODO: Token verification, timing check, collision check, binding with actual player, etc...
		this.testPlayer.x = response.data.x;
		this.testPlayer.y = response.data.y;
		this.sockets.emit('stateUpdate', {
			entityType: 'Player',
			action: 'Update',
			data: this.testPlayer
		});
	}
});



module.exports = function(v) { return new ClientHandler(v); };