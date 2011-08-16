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

var ch; 
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
		ch = this;
		ch.sockets.on('connection', ch.addClient);
	},
	
	addClient : function(client) {
		var player = testPlayer;
		client.set('player', player, function() {
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
				maps.each(function(map) {
					client.join(map.roomID);
				});
			});
			client.emit('stateUpdate', {
				entityType: 'Player',
				action: 'New',
				data: [ player ]
			});
			ch.updatePlayer(player); //TODO: Data sent twice to the current player
			//Get map chunk for player x & y
			client.on('movePlayer', ch.movePlayer);
			client.on('getTileSet', ch.getTileSet);
			client.on('getMaps', ch.getMaps);
		});
	},
	
	movePlayer: function(req) {
		//TODO: Token verification, sintize, timing check, collision check, binding with actual player, etc...
		var client = this;
		client.get('player', function(err, player) {
			var targetX = req.data.x;
			var targetY = req.data.y;
			var tMapX = req.data.mapX;
			var tMapY = req.data.mapY;
			if(targetX < 0 || targetX >= settings.MapWidth || targetY < 0 || targetY >= settings.MapHeight) {
				return;
			}
			if(tMapX !== Number(player.mapX) || tMapY !== Number(player.mapY)) {
				Map.findOne({_id: new ObjectId(String(player.map))}, function(err, oldMap) {
					Map.findOne({x: tMapX, y: tMapY}, function(err, newMap) {
						oldMap.objects.remove(player._id);
						oldMap.save();
						newMap.objects.push(player._id);
						newMap.save();
						for(var y = player.mapY - 1; y <= player.mapY + 1; y++) {
							for(var x = player.mapX - 1; x <= player.mapX + 1; x++) {
								if((x < newMap.x - 1 && targetX > settings.CacheAhead) ||
								 	(x > newMap.x + 1 && targetX < settings.MapWidth - settings.CacheAhead) ||
									(y < newMap.y - 1  && targetY > settings.CacheAhead) ||
									(y > newMap.y + 1 && targetY < settings.MapHeight - settings.CacheAhead)) {
									client.leave(Map.getRoomID(x, y));
								}
							}
						}
						player.map = newMap._id;
						player.x = targetX;
						player.y = targetY;
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
				console.log('Map - x: ' + player.mapX + ', y: ' + player.mapY);
			}
		});
	},
	
	updatePlayer: function(player) {
		ch.sockets.in(Map.getRoomID(player.mapX, player.mapY)).emit('stateUpdate', {
			entityType: 'Player',
			action: 'Update',
			data: [ player ]
		});
	},
	
	getTileSet: function(req) {
		var client = this;
		try {
			TileSet.findOne({_id: new ObjectId(String(req.data))}, function(err, tileSet) {
					if(err) {
						console.log('Error: ' + err);
					} else {
						client.emit('asset', tileSet);
					}
				});
		} catch(err) {
			console.log('getTileSet Error: ' + err);
		}
	},
	
	getMaps: function(req) {
		var client = this;
		try {
			//SECURITY: Sanitize query!
			Map.find({'$or': req.data}, function(err, maps) {
				client.emit('stateUpdate', {
					entityType: 'Map',
					action: 'New',
					data: maps
				});
				maps.each(function(map) {
					client.join(map.roomID);
				});
			})
		} catch(err) {
			console.log('getMaps Error: ' + err);
		}
	}
});



module.exports = function(v) { return new ClientHandler(v); };