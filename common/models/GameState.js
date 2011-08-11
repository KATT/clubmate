var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var MapSchema = require('./Map').MapSchema;

var GameStateSchema = new Schema({
	map				: [ MapSchema ]
});


module.exports.GameState = mongoose.model('GameState', GameStateSchema);
module.exports.GameStateSchema = GameStateSchema;