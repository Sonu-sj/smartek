var track = require('../models/model.js');
//console.log(track);
module.exports.findtracks = function(callback) {
    track.find({}).limit(8).sort({
        '_id': -1
    }).exec(callback)
}
module.exports.subtract = function() {
    console.log(3 - 2);
}
