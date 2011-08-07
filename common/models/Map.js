var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var TilesSchema = require('./Tiles').TilesSchema;
var PlayerSchema = require('./Player').PlayerSchema;

var MapSchema = new Schema({
	tiles	: [ TilesSchema ],
	width	: { type: Number },
	height	: { type: Number },
});


module.exports.Map = mongoose.model('MapSchema', MapSchema);
module.exports.MapSchema = MapSchema;
