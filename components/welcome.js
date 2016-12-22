// console.js
// var exportst = module.exports = {};
var config = require('../config')
var qs = require('querystring')
var xhr = require('xhr')

exports.getGithubProfile = function (token, callback) {
  var options = {
    url: 'https://api.github.com/user',
    json: true,
    headers: {
      authorization: 'token ' + token
    }
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}

exports.renderWelcomeMessage = function (name) {
  if (name.name == null) {
    userName = name.login
  } else {
    userName = name.name
  }
  profileName = name.login; //do this better
  var p = document.createElement('p')
  p.innerHTML = 'Welcome '+userName
  document.body.appendChild(p)
}
