// console.js
// var exportst = module.exports = {};
var config = require('../config')
var qs = require('querystring')
var xhr = require('xhr')
var cookie = require('cookie-cutter')

exports.logoutButton = function () {
  var logout = document.createElement('a')
  logout.href = '#'
  logout.innerHTML = 'log out'
  document.body.appendChild(logout)

  logout.addEventListener('click', function (e) {
    e.preventDefault()
    cookie.set('github-api-access-token', '')
    cookie.set('travis-api-access-token', '')
    window.location = window.location
  })
}
