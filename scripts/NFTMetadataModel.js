const mongoose = require('mongoose');

// Defining schema
let NFTSchema = new mongoose.Schema({
    tokenId: {type: Number},
    minPrice: {type: Number},
    tokenURI: {type: String},
    signature: {type: String}
}, 
{
    collection: 'metadata',
    versionKey: false
})

// Exporting dB schema
module.exports = mongoose.model('metadata', NFTSchema);