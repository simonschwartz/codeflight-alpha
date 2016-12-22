// console.js
// var exports = module.exports = {};
var config = require('../config')
var qs = require('querystring')
var xhr = require('xhr')

exports.getCode = function() {
  var query = window.location.href.split('?')[1]
  return qs.parse(query).code
}

exports.getToken = function(code, callback) {

  var options = {
    url: config.gatekeeper + '/authenticate/' + code,
    json: true
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body.token)
  })
}

exports.loginForm = function () {
  var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&read:org&user:email&repo_deployment&repo:status&scope=repo&write:repo_hook&redirect_uri=' + config.redirect_uri
  var link = document.createElement('a')
  link.href = url
  link.innerHTML = 'Log in with GitHub'
  document.body.appendChild(link)
}



/*
function getCode () {
  var query = window.location.href.split('?')[1]
  return qs.parse(query).code
}

function getToken (code, callback) {
  var options = {
    url: config.gatekeeper + '/authenticate/' + code,
    json: true
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body.token)
  })
}
*/
