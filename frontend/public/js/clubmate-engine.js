CM.Engine = function() {
	var loadAsset = function(url, onLoaded) {
		var tsImage = new Image();
		tsImage.onload = onLoaded;
		tsImage.src = CM.Settings.TilePath + url;
	};
	var movePlayer = function(dx, dy) {
		var targetX = CM.State.Player.options.x + dx;
		var targetY = CM.State.Player.options.y + dy;
		var tMapX = CM.State.Player.options.mapX;
		var tMapY = CM.State.Player.options.mapY;
		if(targetX >= CM.Settings.MapWidth) {
			targetX -= CM.Settings.MapWidth;
			tMapX++;
		} else if (targetX < 0) {
			targetX += CM.Settings.MapWidth;
			tMapX--;
		}
		if(targetY >= CM.Settings.MapHeight) {
			targetY -= CM.Settings.MapHeight;
			tMapY++;
		} else if (targetY < 0) {
			targetY += CM.Settings.MapHeight;
			tMapY--;
		}
		CM.NetMan.Send('movePlayer', { x: targetX, y: targetY, mapX: tMapX, mapY: tMapY });
	};
	var gameLoop = function() {
		drawFrame();
	};
	var drawFrame = function() {
		CM.Engine.context.clearRect(0-CM.Settings.xOffset*CM.Settings.TileWidth, 0-CM.Settings.yOffset *CM.Settings.TileHeight, CM.Settings.ViewWidth*CM.Settings.TileWidth, CM.Settings.ViewHeight*CM.Settings.TileHeight);
		CM.State.Map.Chunks.each(function(chunk){
			CM.Engine.RedrawMap(chunk);
		});
		try {
			var status = document.id('status');
			var message = '<table id="messageTable"><tr><td>Player</td><td>{x: '+CM.State.Player.options.x+', y: '+CM.State.Player.options.y+'}</td></tr><tr><td>Map</td><td>{x: '+CM.State.Player.options.mapX+', y: '+CM.State.Player.options.mapY+'}</td></tr><tr>'; 
			CM.State.Map.Chunks.each(function(chunk, index) {
				message += '<td>' + index + ': {x: '+chunk.options.x+', y: '+chunk.options.y+'}</td>';
				if((index+1)%3 == 0) {
					message += '</tr><tr>'
				}
			});
			status.innerHTML = message + '</tr></table>';
		} catch(err) {}
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
		InitMapTiles: function(tileSet) {
			loadAsset(tileSet.url, function() {
				CM.NetMan.LoadedAssets[tileSet._id].image = this;
			});
		},
		RedrawMap: function(mapChunk) {
			var tileSet = CM.NetMan.LoadedAssets[mapChunk.options.tileSet];
			if(tileSet && tileSet.image) {
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
