// console.js
// var exportst = module.exports = {};
var config = require('../config')
var qs = require('querystring')
var xhr = require('xhr')

exports.getTravisToken = function(token, callback) {
  var options = {
    url: config.gatekeeper + '/auth/travis/'+token,
    json: true
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body.access_token)
  })
}
