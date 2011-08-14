require('mootools');
var db = require('../../common/db').db;
var GameState = require('../../common/models/GameState').GameState;
var TileSet = require('../../common/models/TileSet').TileSet;
var Map = require('../../common/models/Map').Map;
var Sprite = require('../../common/models/Sprite').Sprite;
var Player = require('../../common/models/Player').Player;
var enums = require('../lib/enums')
var ObjectId = require('mongoose').Types.ObjectId; 
var settings = require('../public/js/clubmate-settings.js')

var gameState; 
var testPlayer;
GameState.findOne(function(err, gs) {
	gameState = gs;
});
Player.findOne(function(err, p) {
	testPlayer = p;
});

var ClientHandler = new Class({
	sockets: {},
	
	initialize : function(sockets) {
		// Fetch game state from db
		this.sockets = sockets;
		this.sockets.on('connection', this.addClient.bind(this));
	},
	
	addClient : function(client) {
		client.set('token', 'test');
		var player = testPlayer;
		var mapQuery = Map.find({x: {'$gte': player.mapX - 1, '$lte': player.mapX + 1}, y: {'$gte': player.mapY - 1, '$lte': player.mapY + 1}});
		mapQuery.sort('y', 1, 'x', 1);
		mapQuery.exec(function(err, maps) {
			if (err) {
				console.log('Map Error: ' + err);
				throw err;
			}
			client.emit('stateUpdate', {
				entityType: 'Map',
				action: 'New',
				data: maps
			});
		});
		
		client.emit('stateUpdate', {
			entityType: 'Player',
			action: 'New',
			data: [ player ]
		});
		//Get map chunk for player x & y
		client.on('movePlayer', this.movePlayer.bind(this));
		client.on('getTileSet', this.getTileSet.bind(this));
		client.on('getMaps', this.getMaps.bind(this));
	},
	
	movePlayer: function(req) {
		//TODO: Token verification, timing check, collision check, binding with actual player, etc...
		var player = testPlayer;
		var targetX = req.data.x;
		var targetY = req.data.y;
		var ch = this;
		var newMap = {x: player.mapX, y: player.mapY};
		if(targetX < 0) {
			newMap.x--;
		} else if(targetX >= settings.MapWidth) {
			newMap.x++;
			player.x = 0;
		}
		if(targetY < 0) {
			newMap.y--;
		} else if(targetY >= settings.MapHeight) {
			newMap.y++;
			player.y = 0;
		}
		if(Number(newMap.x) !== Number(player.mapX) || Number(newMap.y) !== Number(player.mapY)) {
			Map.findOne({_id: new ObjectId(String(player.map))}, function(err, oldMap) {
				Map.findOne({x: newMap.x, y: newMap.y}, function(err, newMap) {
					console.log('New chunk!')
					oldMap.objects.remove(player._id);
					oldMap.onlinePlayers.remove(player._id);
					oldMap.save();
					newMap.objects.push(player._id);
					newMap.onlinePlayers.push(player._id);
					newMap.save();
					player.map = newMap._id;
					
					player.x = newMap.x < oldMap.x ? settings.MapWidth - 1 : player.x;
					player.y = newMap.y < oldMap.y ? settings.MapHeight - 1 : player.y;
					player.mapX = newMap.x;
					player.mapY = newMap.y;
					player.save();
					ch.updatePlayer(player);
					console.log('Player - x: ' + player.x + ', y: ' + player.y);
					console.log('Map - x: ' + newMap.x + ', y: ' + newMap.y);
				});
			});
		} else {
			player.x = targetX;
			player.y = targetY;
			player.save();
			ch.updatePlayer(player);
			console.log('Player - x: ' + player.x + ', y: ' + player.y);
			console.log('Map - x: ' + newMap.x + ', y: ' + newMap.y);
		}
	},
	
	updatePlayer: function(player) {
		this.sockets.emit('stateUpdate', {
			entityType: 'Player',
			action: 'Update',
			data: [ player ]
		});
	},
	
	getTileSet: function(req) {
		try {
			var client = this;
			TileSet.findOne({_id: new ObjectId(String(req.data))}, function(err, tileSet) {
					if(err) {
						console.log('Error: ' + err);
					} else {
						client.sockets.emit('asset', tileSet);
					}
				});
		} catch(err) {
			console.log('getTileSet Error: ' + err);
		}
	},
	
	getMaps: function(req) {
		try {
			var client = this;
			//SECURITY: Sanitize query!
			Map.find({'$or': req.data}, function(err, maps) {
				client.sockets.emit('stateUpdate', {
					entityType: 'Map',
					action: 'New',
					data: maps
				});
			})
		} catch(err) {
			console.log('getMaps Error: ' + err);
		}
	}
});



module.exports = function(v) { return new ClientHandler(v); };