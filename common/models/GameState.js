var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var MapSchema = require('./Map').MapSchema;
var PlayerSchema = require('./Player').PlayerSchema;

var GameStateSchema = new Schema({
	players			: [ PlayerSchema ],
	map				: [ MapSchema ] // Map
});


module.exports.GameState = mongoose.model('GameState', GameStateSchema);
module.exports.GameStateSchema = GameStateSchema;