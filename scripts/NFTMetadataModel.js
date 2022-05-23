const mongoose = require('mongoose');

let NFTSchema = new mongoose.Schema({
    tokenId: {type: Number},
    minPrice: {type: String},
    tokenURI: {type: String},
    signature: {type: String}
}, 
{
    collection: 'metadata',
    versionKey: false
}
)

module.exports = mongoose.model('metadata', NFTSchema);