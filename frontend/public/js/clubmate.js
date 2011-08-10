var CM = function() {
	var Init = function() {
		CM.UIManager.InitUI();
		CM.Components.Init();
		CM.NetMan.Init();
	};
	return {
		Components: {},
		UIManager: {},
		NetMan: {},
	    Settings: {},
	    Strings: {},
		State: {
			Player: {},
			Objects: {},
			Map: {
				TileTypes: [],
				Chunks: [{}, {}, {},{}, {}, {},	{}, {}, {}],
				MiddleChunk: {x: 0, y: 0}
			}
		},
	    DebugA: null,
		DebugB: null,
		
		Init: Init
	};
} ();

CM.UIManager = function() {
	var loadAsset = function(url, onLoaded) {
		if(!Crafty.assets[url]) {
			Crafty.load([url], onLoaded);
		} else {
			onLoaded();
		}
	};
	var movePlayer = function(dx, dy) {
		CM.NetMan.Send('movePlayer', { x: CM.State.Player.options.x + dx, y: CM.State.Player.options.y + dy });
	};

	return {
		InitUI: function() {
			var width = CM.Settings.ViewWidth*CM.Settings.TileWidth;
			var height = CM.Settings.ViewHeight*CM.Settings.TileHeight;
			Crafty.init(width, height);
			Crafty.background(CM.Settings.BackgroundColor);
			Crafty.scene('main', CM.Scenes.Main);
			Crafty.scene('main');
			
			var keyboardListener = new Keyboard({
				active: true
			});
			keyboardListener.addEvents({
			    'up': function() { movePlayer(0, -1); },
			    'down': function() { movePlayer(0, 1); },
			    'left': function() { movePlayer(-1, 0); },
			    'right': function() { movePlayer(1, 0); },
			});
		},
		InitEntityForObject: function(obj) {
			var e = Crafty.e(obj.options.components);
			e.Object = obj;
			e.UpdatePosition();
		},
		InitSpriteMap: function(tileSize, url, spriteMap) {
			Crafty.sprite(tileSize, CM.Settings.SpritePath + url, spriteMap);
		},
		RedrawMap: function(mapChunk, tileSet) {
			loadAsset(CM.Settings.TilePath + tileSet.url, function() {
				Crafty.sprite(CM.Settings.TileWidth, CM.Settings.TilePath + tileSet.url, tileSet.tiles);
				for (var x = 0; x < CM.Settings.ViewWidth; x++) {
					for(var y = 0; y < CM.Settings.ViewHeight; y++) {
						var tileType = CM.State.Map.TileTypes[mapChunk.options.tiles[x + y*mapChunk.options.width]]; //TODO: Right index based on player position and shit
						Crafty.e('2D, DOM, ' + tileType).attr({x: x*CM.Settings.TileWidth, y: y*CM.Settings.TileHeight, z:1});//.css({top: y*CM.Settings.TileHeight + 'px', left: x*CM.Settings.TileWidth + 'px'});
					}
				}
			});
		},
	};
}();

CM.NetMan = function() {
	var Socket = null;
	
	return {
		Init: function () {
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('asset', function (response) {
				if(response.type == CM.Enums.AssetTypes.Sprite) {
					var tileSize = typeof response.tileSize == 'undefined' ? 1 : response.tileSize;
					CM.UIManager.InitSpriteMap(tileSize, response.url, response.spriteMap);
				}
			});
			Socket.on('stateUpdate', function (response) {
				CM[response.entityType]['on' + response.action](response.data);
			});
		},
		Send: function(command, data) {
			if(Socket == null) {
				alert("Socket not initialized!");
				return;
			}
			Socket.emit(command, {token: 'token', data: data});
		}
	}
} ();

CM.Player = new Class({
	Implements: [Options, Events],
	options: {
		alias: 'Anon',
		x: 0,
		y: 0,
		onUpdate: function(options) {
			//When player update is received. Just to make it more general and apply a base class to other players than self in the future.
			this.setOptions(options);
		}
	},
	initialize: function(options) {
		this.setOptions(options);
	},
});
CM.Player.extend({
	onNew: function(data) {
		var player = new CM.Player(data);
		CM.State.Objects[player.options.id] = player;
		CM.State.Player = player;
		CM.UIManager.InitEntityForObject(player);
	},
	onUpdate: function(data) {
		CM.State.Player.fireEvent('update', data);
	}
})

CM.Map = new Class({
	Implements: [Options, Events],
	options: {
		tiles: [],
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	initialize: function(data) {
		this.setOptions(data);
	}	
});
CM.Map.extend({
	onNew: function(data) {
		if(data.tileTypes) {
			CM.State.Map.TileTypes = data.tileTypes;
		}
		if(data.map) {
			var map = new CM.Map(data.map);
			CM.State.Map.Chunks[(1+data.y)*3+data.x+1] = map; //middle in array is 0:0
			CM.UIManager.RedrawMap(map, data.tileSet);
		}
	},
	onUpdate: function(data) {}
});

CM.Scenes = function() {
	return {
		Loading: function () {
		},
		Main: function () {
		}
	};

} ();
window.addEvent('domready', CM.Init);