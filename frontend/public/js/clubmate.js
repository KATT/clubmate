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
			obj.Entity = e;
			e.UpdatePosition();
		},
		InitSpriteMap: function(tileSize, url, spriteMap) {
			Crafty.sprite(tileSize, CM.Settings.SpritePath + url, spriteMap);
			for(var i in CM.State.Objects) {
				var obj = CM.State.Objects[i];
				if(typeof obj.Entity == 'undefined') {
					CM.UIManager.InitEntityForObject(obj);
				}
			}
		},
		InitMapTiles: function(tileSet) {
			loadAsset(CM.Settings.TilePath + tileSet.url, function() {
				for(var i in CM.State.Map.Chunks) {
					var chunk = CM.State.Map.Chunks[i];
					if(chunk.options && chunk.options.tileSet == tileSet._id) {
						CM.UIManager.RedrawMap(chunk, tileSet);
					}
				}
			});
		},
		
		RedrawMap: function(mapChunk, tileSet) {
			loadAsset(CM.Settings.TilePath + tileSet.url, function() {
				Crafty.sprite(CM.Settings.TileWidth, CM.Settings.TilePath + tileSet.url, tileSet.data);
				for (var x = 0; x < mapChunk.options.width; x++) {
					for(var y = 0; y < mapChunk.options.height; y++) {
						//var tileType = tileSet.tileTypes[mapChunk.options.tiles[CM.State.Player.options.x + x + CM.Settings.xOffset + (CM.State.Player.options.y + y + CM.Settings.yOffset)*mapChunk.options.width]]; //TODO: Right index based on player position and shit
						var tileType = tileSet.tileTypes[mapChunk.options.tiles[CM.State.Player.options.x + x + (CM.State.Player.options.y + y)*mapChunk.options.width]]; //TODO: Right index based on player position and shit
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
		LoadedAssets: [],
		Init: function () {
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('asset', function (response) {
				switch(response.type) {
					case CM.Enums.AssetTypes.Sprite:
						var tileSize = typeof response.tileSize == 'undefined' ? 1 : response.tileSize;
						CM.UIManager.InitSpriteMap(tileSize, response.url, response.data);
						break;
					case CM.Enums.AssetTypes.MapTiles:
						CM.UIManager.InitMapTiles(response);
						break;
				}
				CM.NetMan.LoadedAssets.push(response._id);
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
		},
		GetTileSet: function(id) {
			this.Send('getTileSet', id);
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
		data.components = data.sprite.key + ', animate, gameSprite'
		var player = new CM.Player(data);
		CM.State.Objects[player.options._id] = player;
		CM.State.Player = player;
		if(CM.NetMan.LoadedAssets[data.sprite.tileSet]) {
			CM.UIManager.InitEntityForObject(player);
		} else {
			CM.NetMan.GetTileSet(data.sprite.tileSet);
		}
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
		var map = new CM.Map(data);
		CM.State.Map.Chunks[(1+data.y)*3+data.x+1] = map; //middle in array is 0:0

		if(CM.NetMan.LoadedAssets[map.tileSet]) {
			CM.UIManager.RedrawMap(map);
		} else {
			CM.NetMan.GetTileSet(data.tileSet);
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