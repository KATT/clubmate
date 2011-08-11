var mongoose = require('mongoose'),
	Schema	 = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var SpriteSchema = new Schema({
	tileSet: { type: ObjectId },
	key: { type: String }
});

module.exports.Sprite = mongoose.model('Sprite', SpriteSchema);
module.exports.SpriteSchema = SpriteSchema;

