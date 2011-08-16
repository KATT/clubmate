var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var PlayerSchema = require('./Player').PlayerSchema;

var MapSchema = new Schema({
	tiles	: [ Number ],
	tileSet : ObjectId,
	objects: [ ObjectId ],
	onlinePlayers: [ ObjectId ],
	width	: { type: Number },
	height	: { type: Number },
	x : { type: Number },
	y : { type: Number }
});

MapSchema.virtual('roomID').get(function() {
	return this.schema.statics.getRoomID(this.x, this.y);
});

MapSchema.static('getRoomID', function(x, y) {
	return 'map'+x+':'+y;
});

module.exports.Map = mongoose.model('Map', MapSchema);
module.exports.MapSchema = MapSchema;

