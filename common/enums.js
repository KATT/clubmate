if(CM == undefined) { var CM = {} };

CM.Enums = {
    AssetTypes: {
        Sprite: 0,
        MapTiles: 1,
		Audio: 5
    },
}

if(typeof module != 'undefined') {
    module.exports = CM.Enums;
}
