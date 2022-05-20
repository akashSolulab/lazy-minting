const mongoose = require('mongoose');

let NFTSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tokenId: {type: Number},
    tokenURI: {type: String},
    signature: {type: String}
})

module.exports = mongoose.model('metadata', NFTSchema);