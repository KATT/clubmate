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
	return {
		InitUI: function() {
			var width = CM.Settings.ViewWidth*CM.Settings.TileWidth;
			var height = CM.Settings.ViewHeight*CM.Settings.TileHeight;
			Crafty.init(width, height);
			Crafty.background(CM.Settings.BackgroundColor);
			Crafty.scene('main', CM.Scenes.Main);
			Crafty.scene('main');
		},
		InitEntityForObject: function(obj) {
			Crafty.e(obj.options.components);
		},
		RedrawMap: function(mapChunk, tileSet) {
			loadAsset(CM.Settings.TilePath + tileSet.url, function() {
				Crafty.sprite(CM.Settings.TileWidth, CM.Settings.TilePath + tileSet.url, tileSet.tiles);
				for (var x = 0; x < CM.Settings.ViewWidth; x++) {
					for(var y = 0; y < CM.Settings.ViewHeight; y++) {
						var tileType = CM.State.Map.TileTypes[mapChunk.options.tiles[x + y*mapChunk.options.width]]; //TODO: Right index based on player position and shit
						Crafty.e('2D, DOM, ' + tileType).attr({x: x*CM.Settings.TileWidth, y: y*CM.Settings.TileHeight, z:1}).css({top: y*CM.Settings.TileHeight + 'px', left: x*CM.Settings.TileWidth + 'px'});
					}
				}
			});
		}
	};
}();

CM.NetMan = function() {
	var Socket  = null;
	
	return {
		Init: function () {
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('asset', function (response) {
				if(response.type == CM.Enums.AssetTypes.Sprite) {
					var tileSize = typeof response.tileSize == 'undefined' ? 1 : response.tileSize;
					Crafty.sprite(tileSize, CM.Settings.SpritePath + response.url, response.spriteMap);
				}
			});
			Socket.on('stateUpdate', function (response) {
				CM[response.entityType]['on' + response.action](response.data);
			});
		}
	}
} ();

CM.Player = new Class({
	Implements: [Options, Events],
	options: {
		alias: 'Anon',
		x: 0,
		y: 0,
		onUpdate: function(data) {
			//When player update is received. Just to make it more general and apply a base class to other players than self in the future.
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