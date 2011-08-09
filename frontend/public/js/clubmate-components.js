CM.Components = function() {
	return {
		Init: function() {
			Crafty.c('gameSprite', {
				Object: {},
				init: function() {
					this.requires('2D, DOM');
					this.attr({w: CM.Settings.TileWidth, h: CM.Settings.TileHeight, z: 2});
					//this.animate('walk_right', [[120,8], [96,8], [120,8], [72,8]]);
				},
				onEnterFrame: function() {
					if(this.has('animate')) {
						var dx = 0;
						var dy = 0;
						if(this.x != this.Object.x * CM.Settings.TileWidth) {
							dx = this.x > this.Object.x * CM.Settings.TileWidth ? -1 : 1;
						}
						if(this.y != this.Object.y * CM.Settings.TileHeight) {
							dy = this.x > this.Object.x * CM.Settings.TileHeight ? -1 : 1;
						}
						this.x += dx;
						this.y += dy;
					} else {
						this.x = this.Object.x;
						this.y = this.Object.y;
					}
				}
			});
		}
	};
} ();
