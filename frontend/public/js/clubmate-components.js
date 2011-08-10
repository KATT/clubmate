CM.Components = function() {
	return {
		Init: function() {
			Crafty.c('gameSprite', {
				Object: {},
				init: function() {
					this.requires('2D, DOM');
					this.attr({w: CM.Settings.TileWidth, h: CM.Settings.TileHeight, z: 2});
					//this.animate('walk_right', [[120,8], [96,8], [120,8], [72,8]]);
					this.bind('EnterFrame', function() {
						var targetX = this.Object.options.x * CM.Settings.TileWidth;
						var targetY = this.Object.options.y * CM.Settings.TileHeight;
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
					this.x = this.Object.options.x* CM.Settings.TileWidth;
					this.y = this.Object.options.y* CM.Settings.TileHeight;
				}
			});
		}
	};
} ();
