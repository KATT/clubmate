var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/clubmate')

module.exports = {
	db: db
}