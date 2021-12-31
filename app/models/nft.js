const mongoose = require('mongoose')

const nftSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  artCollection: {
    type: String,
    required: false
  },
  thumbnail: {
    type: String,
    required: true
  },
  priceEther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Nft', nftSchema)
