var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema;

var utils = require('../utils');

var PlayerSchema = new Schema({
	user		: { type: String, unique: true, validate: /^[A-Z0-9._%+-]+$/i },
	
	password	: { type: String, index: true, set: setPassword },
	email		: { type: String, unique: false, set: toLower, validate: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i },
	
	apiKey		: { type: String, unique: true },
	
	created		: {type: Date, default: Date.now}
	
});

var salt = 'JRt3bzghjJ';

function setPassword(pwd) {
	pwd = hash(pwd);
	this.apiKey = utils.hash(this.user,pwd,Math.random());
	
	
	return pwd;
}


module.exports.Player = mongoose.model('Player', PlayerSchema);
module.exports.PlayerSchema = PlayerSchema;