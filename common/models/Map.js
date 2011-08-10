var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var TilesSchema = require('./Tiles').TilesSchema;
var PlayerSchema = require('./Player').PlayerSchema;

var MapSchema = new Schema({
	tiles	: [ Number ],
	objects: [ObjectId],
	onlinePlayers: [ObjectId],
	width	: { type: Number },
	height	: { type: Number },
	x : { type: Number },
	y : { type: Number }
});


module.exports.Map = mongoose.model('MapSchema', MapSchema);
module.exports.MapSchema = MapSchema;

