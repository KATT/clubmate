if(CM == undefined) { var CM = {} };

CM.Settings = {
	SocketURL : 'http://localhost/',
	BackgroundColor: '#000',
	ViewWidth: 20,
	ViewHeight: 14,
	xOffset: 10,
	yOffset: 7,
	TileWidth: 24,
	TileHeight: 24,
	FPS: 50,
	TilePath: '/images/',
	SpritePath: '/images/',
	MapWidth: 40,
	MapHeight: 28,
	CacheAhead: 5 //How many tiles the player has to move in to a chunk to start loading the adjacent ones
};


if(typeof module != 'undefined') {
    module.exports = CM.Settings;
}