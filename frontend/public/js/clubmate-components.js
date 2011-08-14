CM.Components = function() {
	return {
		Init: function() {
			Crafty.c('player', {
				init: function() {
					this.requires('gameSprite, animate'); 
					this.bind('EnterFrame', function() {
						var xPos = (CM.Settings.xOffset)*CM.Settings.TileWidth - this.x;
						var yPos = (CM.Settings.yOffset)*CM.Settings.TileWidth - this.y;
						if(Crafty.viewport.x > xPos) {
							Crafty.viewport.x--;
						} else if(Crafty.viewport.x < xPos) {
							Crafty.viewport.x++;
						}
						if(Crafty.viewport.y > yPos) {
							Crafty.viewport.y--;
						} else if(Crafty.viewport.y < yPos) {
							Crafty.viewport.y++;
						}
						if(CM.State.Map.Chunks.length == 9) {
							var replaceChunks = [];
							var chunks = CM.State.Map.Chunks;
							var mapX = this.Object.options.mapX;
							var mapY = this.Object.options.mapY;
							if(!chunks[3].options.replace && mapX <= chunks[3].options.x && this.Object.options.x < CM.Settings.MapWidth - CM.Settings.CacheAhead) {
								//Walking west
								chunks = [	chunks[2], chunks[0], chunks[1],
											chunks[5], chunks[3], chunks[4], 
											chunks[8], chunks[6], chunks[7]];
								chunks[0].options.replace = chunks[3].options.replace = chunks[6].options.replace = true;
								replaceChunks.combine([{x: mapX - 1, y: chunks[0].options.y}, {x: mapX - 1, y: chunks[3].options.y}, {x: mapX - 1, y: chunks[6].options.y}]);
							} else if(!chunks[5].options.replace && mapX >= CM.State.Map.Chunks[5].options.x && this.Object.options.x > CM.Settings.CacheAhead) {
								//Walking east
								chunks = [	chunks[1], chunks[2], chunks[0],
											chunks[4], chunks[5], chunks[3], 
											chunks[7], chunks[8], chunks[6]];
								chunks[2].options.replace = chunks[5].options.replace = chunks[8].options.replace = true;
								replaceChunks.combine([{x: mapX + 1, y: chunks[2].options.y}, {x: mapX + 1, y: chunks[5].options.y}, {x: mapX + 1, y: chunks[8].options.y}]);
							}
							if(!chunks[1].options.replace && mapY <= chunks[1].options.y && this.Object.options.y < CM.Settings.MapHeight - CM.Settings.CacheAhead) {
								//Walking up
								chunks = [	chunks[6], chunks[7], chunks[8],
											chunks[0], chunks[1], chunks[2], 
											chunks[3], chunks[4], chunks[5]];
								chunks[0].options.replace = chunks[1].options.replace = chunks[2].options.replace = true;
								replaceChunks.combine([{x: chunks[0].options.x, y: mapY - 1}, {x: chunks[1].options.x, y: mapY - 1}, {x: chunks[2].options.x, y: mapY - 1}]);
							} else if(!chunks[7].options.replace && mapY >= CM.State.Map.Chunks[7].options.y && this.Object.options.y > CM.Settings.CacheAhead) {
								//Walking down
								chunks = [	chunks[3], chunks[4], chunks[5],
											chunks[6], chunks[7], chunks[8], 
											chunks[0], chunks[1], chunks[2]];
								chunks[6].options.replace = chunks[7].options.replace = chunks[8].options.replace = true;
								replaceChunks.combine([{x: chunks[6].options.x, y: mapY + 1}, {x: chunks[7].options.x, y: mapY + 1}, {x: chunks[8].options.x, y: mapY + 1}]);
							}
							CM.State.Map.Chunks = chunks;
							if(replaceChunks.length > 0) {
								CM.NetMan.Send('getMaps', replaceChunks);
							}
						}
					});
				}
			});
			Crafty.c('gameSprite', {
				Object: {},
				init: function() {
					this.requires('2D, DOM');
					this.attr({w: CM.Settings.TileWidth, h: CM.Settings.TileHeight, z: 2});
					//this.animate('walk_right', [[120,8], [96,8], [120,8], [72,8]]);
					this.bind('EnterFrame', function() {
						var xOffset = CM.State.Player.options.mapX*CM.Settings.MapWidth;
						var yOffset = CM.State.Player.options.mapY*CM.Settings.MapHeight;
						var targetX = (this.Object.options.x + xOffset) * CM.Settings.TileWidth;
						var targetY = (this.Object.options.y + yOffset) * CM.Settings.TileHeight;
						if(this.y != targetY || this.x != targetX) {
							if(this.has('animate')) {
								var dx = 0;
								var dy = 0;
								if(targetX > this.x) { dx = 1; } else if (targetX < this.x) {dx = -1; }
								if(targetY > this.y) { dy = 1; } else if (targetY < this.y) {dy = -1; }
								this.x += dx;
								this.y += dy;
							} else {
								this.UpdatePosition();
							}
						}
					});
				},
				
				UpdatePosition: function() {
					this.x = (this.Object.options.x + CM.State.Player.options.mapX*CM.Settings.MapWidth)* CM.Settings.TileWidth;
					this.y = (this.Object.options.y + CM.State.Player.options.mapY*CM.Settings.MapHeight)* CM.Settings.TileHeight;
				}
			});
		}
	};
} ();
