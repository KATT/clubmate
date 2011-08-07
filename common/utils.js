

function hash() {
	var str = salt;
	
	for (var i in hash.arguments) {
		str += ";" + hash.arguments[i];
	}
	//console.log("hash base: ", str);
	return hashlib.sha1(str);
}

module.exports = {
	hash: hash,
}