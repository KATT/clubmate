var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var MapSchema = require('./Map').MapSchema;

var GameStateSchema = new Schema({
	map				: [ ObjectId ]
});


module.exports.GameState = mongoose.model('GameState', GameStateSchema);
module.exports.GameStateSchema = GameStateSchema;