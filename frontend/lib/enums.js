if(CM == undefined) { var CM = {} };

CM.Enums = {
	EntityTypes: {
		Player: 'Player',
		Map: 'Map',
		Objects: 'Objects'
	},
	Actions: {
		New: 'New',
		Update: 'Update'
	}
}

if(typeof module != 'undefined') {
	module.exports = CM.Enums;
}