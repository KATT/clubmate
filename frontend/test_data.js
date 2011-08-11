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
function createMaps(tileSet, player) {
	var maps = [];
	var mapData = {
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
		width: 20,
		height: 14,
		tileSet: tileSet		
	};
	
	for(var x = -2; x <= 2; x++) {
		for(var y=-2; y <=2 ; y++) {
			var m = new Map(mapData);
			m.x = x;
			m.y = y;
			if(x == 0 && y == 0) {
				m.objects = [player];
				m.onlinePlayers = [player];
				m.tiles = [
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,2,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1];
			 	player.map = m;
			}
			maps.push(m);
		}
	}
	return maps;
}

function createGameState(maps) {
	var gameState = new GameState({
		map: maps
	});
	gameState.save();
	return gameState;
}

var player = createPlayer(createSprite());
var maps = createMaps(createTileSet(), player);
var gameState = createGameState(maps);
player.save();
console.log('finished');

//Add for each player: components: 'animate, gameSprite'
