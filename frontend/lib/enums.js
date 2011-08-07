if(CM == undefined) { var CM = {} };

CM.Enums = {
	EntityTypes: {
		Player: 10,
		Map: 20,
		Objects: 30
	},
	Actions: {
		New: 10,
		Update: 20
	}
}

if(typeof module != 'undefined') {
	module.exports = CM.Enums;
}