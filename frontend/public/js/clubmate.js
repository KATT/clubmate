var CM = function() {
	var Init = function() {
		CM.UIManager.InitUI();
		CM.Components.Init();
		CM.Engine.Init();
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
				Chunks: []
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
			Crafty.background('transparent');
			Crafty.scene('main', CM.Scenes.Main);
			Crafty.scene('main');
			Crafty.viewport.x = CM.Settings.xOffset*CM.Settings.TileWidth;
			Crafty.viewport.y = CM.Settings.yOffset*CM.Settings.TileHeight;
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
		Scroll: function(x, y) {
			Crafty.viewport.x = (CM.Settings.xOffset - x - CM.State.Player.options.mapX*CM.Settings.MapWidth)*CM.Settings.TileWidth;
			Crafty.viewport.y = (CM.Settings.yOffset - y - CM.State.Player.options.mapY*CM.Settings.MapHeight)*CM.Settings.TileWidth;
		}
	};
}();

CM.NetMan = function() {
	var Socket = null;
	
	return {
		LoadedAssets: {},
		LoadingAssets: [],
		Init: function () {
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('asset', function (response) {
				switch(response.type) {
					case CM.Enums.AssetTypes.Sprite:
						var tileSize = typeof response.tileSize == 'undefined' ? 1 : response.tileSize;
						CM.UIManager.InitSpriteMap(tileSize, response.url, response.data);
						break;
					case CM.Enums.AssetTypes.MapTiles:
						CM.Engine.InitMapTiles(response);
						break;
				}
				CM.NetMan.LoadedAssets[response._id] = response;
				CM.NetMan.LoadingAssets.erase(response._id);
			});
			Socket.on('stateUpdate', function (response) {
				response.data.each(function(item, i) {
					CM[response.entityType]['on' + response.action](item);
				});
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
			if (CM.NetMan.LoadingAssets.indexOf(id) == -1) {
				CM.NetMan.LoadingAssets.push(id);
				this.Send('getTileSet', id);
			}
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
		data.components = data.sprite.key + ', player'
		var player = new CM.Player(data);
		CM.State.Objects[player.options._id] = player;
		CM.State.Player = player;
		if(CM.NetMan.LoadedAssets[data.sprite.tileSet]) {
			CM.UIManager.InitEntityForObject(player);
		} else {
			CM.NetMan.GetTileSet(data.sprite.tileSet);
		}
		CM.UIManager.Scroll(player.options.x, player.options.y);
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
		height: 0,
	},
	initialize: function(data) {
		this.tileEntities = [];
		this.setOptions(data);
		this.options.replace = false;
	},
	update: function(data) {
		this.options.replace = false;
		this.options.tiles = data.tiles;
		this.options.x = data.x;
		this.options.y = data.y;
		this.options.tileSet = data.tileSet;
		this.options.objects = data.objects;
		this.options._id = data._id;
	}
});
CM.Map.extend({
	onNew: function(data) {
		var index;
		var map;
		var mChunk = CM.State.Map.Chunks[4];
		if (mChunk) {
			index = (1+data.y - mChunk.options.y )*3+data.x+1 - mChunk.options.x;
		} else {
			index = (1+data.y - CM.State.Player.options.mapY )*3+data.x+1 - CM.State.Player.options.mapX;
		}
		if(CM.State.Map.Chunks[index]) {
			map = CM.State.Map.Chunks[index];
			if(map.options.replace) {
				map.update(data);
			}
		} else {
			map = new CM.Map(data);
			CM.State.Map.Chunks[index] = map;
		}
		if(!CM.NetMan.LoadedAssets[data.tileSet]) {
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