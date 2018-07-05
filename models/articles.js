var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test',{ useMongoClient: true })

var Schema = mongoose.Schema

var articleSchema = new Schema({
  plate: {
    type: String,
    required: true,
    default: '分享'
  },
  heading: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  publish_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Article',articleSchema)