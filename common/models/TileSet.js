var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var TileSetSchema = new Schema({
	tileSize: { type: Number, default: 24 },
	type: { type: Number },
	tileTypes	: [ String ],
	url: { type: String },
	data: { type: {} }
});

module.exports.TileSet = mongoose.model('TileSet', TileSetSchema);
module.exports.TileSetSchema = TileSetSchema;

