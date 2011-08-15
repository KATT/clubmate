CM.Engine = function() {
	var loadAsset = function(url, onLoaded) {
		var tsImage = new Image();
		tsImage.onload = onLoaded;
		tsImage.src = CM.Settings.TilePath + url;
	};
	var movePlayer = function(dx, dy) {
		CM.NetMan.Send('movePlayer', { x: CM.State.Player.options.x + dx, y: CM.State.Player.options.y + dy });
	};
	var gameLoop = function() {
		drawFrame();
	};
	var drawFrame = function() {
		//CM.Engine.context.save();
		CM.Engine.context.clearRect(0-CM.Settings.xOffset*CM.Settings.TileWidth, 0-CM.Settings.yOffset *CM.Settings.TileHeight, CM.Settings.ViewWidth*CM.Settings.TileWidth, CM.Settings.ViewHeight*CM.Settings.TileHeight);
		//CM.Engine.context.restore();
		
		CM.State.Map.Chunks.each(function(chunk){
			CM.Engine.RedrawMap(chunk);
		});
		
	};
	return {
		frameCount : 0,
		gameTimer: undefined,
		context: undefined,
		Init: function() {
			var width = CM.Settings.ViewWidth*CM.Settings.TileWidth;
			var height = CM.Settings.ViewHeight*CM.Settings.TileHeight;
			var canvas = document.id('canvas');
			canvas.width = width;
			canvas.height = height;
			CM.Engine.context = canvas.getContext('2d');
			this.context.translate(CM.Settings.xOffset * CM.Settings.TileWidth, CM.Settings.yOffset * CM.Settings.TileHeight);
			/*Crafty.init(width, height);
			Crafty.background(CM.Settings.BackgroundColor);
			Crafty.scene('main', CM.Scenes.Main);
			Crafty.scene('main');
			Crafty.viewport.x = CM.Settings.xOffset*CM.Settings.TileWidth;
			Crafty.viewport.y = CM.Settings.yOffset*CM.Settings.TileHeight;*/
			var interval = 1000 / CM.Settings.FPS;
			CM.Engine.gameTimer = setInterval(gameLoop, interval);
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
			loadAsset(tileSet.url, function() {
				CM.NetMan.LoadedAssets[tileSet._id].image = this;
				
				CM.State.Map.Chunks.each(function(chunk) {
					if(chunk.options && chunk.options.tileSet == tileSet._id) {
						CM.UIManager.RedrawMap(chunk, tileSet);
					}
				});
			});
		},
		Scroll: function(x, y) {
			/*sx = (CM.Settings.xOffset - x - CM.State.Player.options.mapX*CM.Settings.MapWidth)*CM.Settings.TileWidth;
			sy = (CM.Settings.yOffset - y - CM.State.Player.options.mapY*CM.Settings.MapHeight)*CM.Settings.TileWidth;
			CM.Engine.context.moveTo(sx, sy);
			CM.Engine.context.save();*/
		},
		RedrawMap: function(mapChunk) {
			//Crafty.sprite(CM.Settings.TileWidth, CM.Settings.TilePath + tileSet.url, tileSet.data);
			var tileSet = CM.NetMan.LoadedAssets[mapChunk.options.tileSet];
			if(tileSet.image) {
				var my = mapChunk.options.y*CM.Settings.TileHeight*mapChunk.options.height;
				var mx = mapChunk.options.x*CM.Settings.TileWidth*mapChunk.options.width;
				for(var y = 0; y < mapChunk.options.height; y++) {
					for (var x = 0; x < mapChunk.options.width; x++) {
						var xPos = mx + x * CM.Settings.TileWidth - CM.State.Player.Entity.x;
						var yPos = my + y * CM.Settings.TileHeight - CM.State.Player.Entity.y;
						var tileIndex = mapChunk.options.tiles[x + y*mapChunk.options.width];
						var tile = tileSet.data[tileSet.tileTypes[tileIndex]];
						if(xPos >= -(CM.Settings.xOffset + 1) * CM.Settings.TileWidth && xPos <= CM.Settings.TileWidth*mapChunk.options.width && yPos >= -(CM.Settings.yOffset+1) * CM.Settings.TileHeight && yPos <= CM.Settings.TileWidth*mapChunk.options.height) {
							CM.Engine.context.drawImage(tileSet.image, tile[0]*CM.Settings.TileWidth, tile[1]*CM.Settings.TileHeight, CM.Settings.TileWidth, CM.Settings.TileHeight, xPos, yPos, CM.Settings.TileWidth, CM.Settings.TileHeight);
						}
					}
				}
			}
		},
	};
}();
