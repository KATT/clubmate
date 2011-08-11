var db = require('../common/db').db;
var enums = require('../common/enums')
var GameState = require('../common/models/GameState').GameState;
var TileSet = require('../common/models/TileSet').TileSet;
var Map = require('../common/models/Map').Map;
var Sprite = require('../common/models/Sprite').Sprite;
var Player = require('../common/models/Player').Player;

function createSprite() {
	var tileSet = new TileSet({
		type: enums.AssetTypes.Sprite,
		url: 'playerOne.png',
		tileSize: 8,
		data: {
			playerOneSprite: [0, 1, 3, 3],
			socialSprite: [0, 5, 3, 3],
			policeSprite: [0, 9, 3, 3]
		}
	});
	tileSet.save();
	var sprite = new Sprite({
		key: 'playerOneSprite',
		tileSet: tileSet
	});
	return sprite;
}

function createPlayer(sprite) {
	var player = new Player({
		alias: 'Bjarne',
		password: 'banan1',
		email: 'skit@skit.com',
		x: 10,
		y: 12,
		targetX: 10,
		targetY: 12,
		sprite: sprite
	});
	player.save();
	return player;
}

function createTileSet() {
	var tileSet = new TileSet({
		tileTypes: ['street', 'fence', 'lawn', 'house'],
		type: enums.AssetTypes.MapTiles,
		url: 'tiles.png',
		data: {street: [0, 0],	fence: [0, 1], lawn: [0, 2], house: [0, 3, 1, 9]}
	});
	tileSet.save();
	return tileSet;
}

function createMap(tileSet, player) {
	var map = new Map({
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
		height: 14,
		objects: [player],
		onlinePlayers: [player],
		tileSet: tileSet		
	});
	//map.save();
	return map;
}

function createGameState(map) {
	var gameState = new GameState({
		map: map
	});
	gameState.save();
	return gameState;
}

var player = createPlayer(createSprite());
var map = createMap(createTileSet(), player);
var gameState = createGameState(map);
player.map = map;
player.save();
console.log('finished');

//Add for each player: components: 'animate, gameSprite'
