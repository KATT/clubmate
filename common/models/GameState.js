var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var TilesSchema = require('./Tiles').TilesSchema;
var PlayerSchema = require('./Player').PlayerSchema;

var GameStateSchema = new Schema({
	players			: [ PlayerSchema ],
	playersOnline	: [ PlayerSchema ],
	map 			: ObjectId // Map
	
});


module.exports.GameState = mongoose.model('GameState', GameStateSchema);
module.exports.GameStateSchema = GameStateSchema;