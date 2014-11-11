var mongoose = require ("mongoose");
var trackSchema = new mongoose.Schema({
 name:'String',	
 artist:'String',
 year : 'Date',
 trackurl:'String',
 imgurl	 :'String'
});
module.exports = mongoose.model('Track', trackSchema);