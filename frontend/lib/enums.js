if(CM == undefined) { var CM = {} };

CM.Enums = {
    AssetTypes: {
        Sprite: 0,
        Audio: 1
    },
}

if(typeof module != 'undefined') {
    module.exports = CM.Enums;
}
