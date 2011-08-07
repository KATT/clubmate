var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;


var TilesSchema = new Schema({
	x	: { type: Number, index:true },
	y	: { type: Number, index:true },
	
	data : { type: Object }
	
});

// @todo ensureIndex 2d x,y
// @link http://www.mongodb.org/display/DOCS/Geospatial+Indexing


module.exports.Tiles = mongoose.model('Tiles', TilesSchema);
module.exports.TilesSchema = TilesSchema;