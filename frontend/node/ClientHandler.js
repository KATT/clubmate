require('mootools');
var db = require('../../common/db').db;
var GameState = require('../../common/models/GameState').GameState;
var TileSet = require('../../common/models/TileSet').TileSet;
var Map = require('../../common/models/Map').Map;
var Sprite = require('../../common/models/Sprite').Sprite;
var Player = require('../../common/models/Player').Player;
var enums = require('../lib/enums')
var ObjectId = require('mongoose').Types.ObjectId; 

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

		var mapid = String(testPlayer.map);
		var map = Map.findOne({_id: new ObjectId(mapid)}, function(err, map) {
			console.log('id: ' + map._id + 'x: ' + map.x + 'y: ' + map.y)
//			Map.find({x: {'$gte': map.x - 1, '$lte': map.x + 1}, y: {'$gte': map.y - 1, '$lte': map.y + 1}}).sort([['y', 'ascending'], ['x', 'descending']], function(err, maps) {
			Map.find({x: {'$gte': map.x - 1, '$lte': map.x + 1}, y: {'$gte': map.y - 1, '$lte': map.y + 1}}, function(err, maps) {
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
		});
		client.emit('stateUpdate', {
			entityType: 'Player',
			action: 'New',
			data: [testPlayer]
		});
		
		//Get map chunk for player x & y
		client.on('movePlayer', this.movePlayer.bind(this));
		client.on('getTileSet', this.getTileSet.bind(this));
	},
	
	movePlayer: function(response) {
		//TODO: Token verification, timing check, collision check, binding with actual player, etc...
		testPlayer.x = response.data.x;
		testPlayer.y = response.data.y;
		this.sockets.emit('stateUpdate', {
			entityType: 'Player',
			action: 'Update',
			data: [testPlayer]
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
	}
});



module.exports = function(v) { return new ClientHandler(v); };