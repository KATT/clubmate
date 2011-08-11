var hashlib = require('hashlib');

var salt = 'JRt3bzghjJ';

function hash() {
	var str = salt;
	
	for (var i in hash.arguments) {
		str += ";" + hash.arguments[i];
	}
	//console.log("hash base: ", str);
	return hashlib.sha1(str);
}

function toLower(str) {
	return str.toLowerCase();
}

module.exports = {
	hash: hash,
	toLower: toLower
}