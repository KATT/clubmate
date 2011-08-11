var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var SpriteSchema = require('./Sprite').SpriteSchema;

var utils = require('../utils');

var PlayerSchema = new Schema({
	alias		: { type: String, unique: true, validate: /^[A-Z0-9._%+-]+$/i },
	password	: { type: String, index: true, set: setPassword },
	email		: { type: String, unique: false, set: utils.toLower, validate: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i },
	apiKey		: { type: String, unique: true },
	created		: { type: Date, default: Date.now },
	
	x: { type: Number },
	y: { type: Number },
	targetX: { type: Number },
	targetY: { type: Number },
	map: { type: ObjectId },
	sprite: { type: {} } //Should be SpriteSchema, dunno why not work ;(
});

function setPassword(pwd) {
	this.apiKey = utils.hash(this.user,pwd,Math.random());
	pwd = utils.hash(pwd);
	
	return pwd;
}


module.exports.Player = mongoose.model('Player', PlayerSchema);
module.exports.PlayerSchema = PlayerSchema;