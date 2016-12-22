// console.js
// var exportst = module.exports = {};
var config = require('../config');
var qs = require('querystring');
var xhr = require('xhr');
var moment = require('moment');

exports.getProjectList = function (travisToken, profile, callback) {
  var options = {
    url: 'https://api.travis-ci.org/repos/' + profileName,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + travisToken,
    },
    data : {
      "repo": {
        'active': true
      }
    }
  };
  xhr(options, function (err, resp, cb) {
    if (err) return callback(err)
    callback(null, cb)
  });
}

exports.renderProjectList = function (project) {
  var list = document.createElement('ul')
  var projectName = "";
  for (var i = 0; i < project.length; i++) {
    if ( project[i].description && project[i].description.indexOf('built with name') != -1 ) {
      if (project[i].last_build_status == 0) {
        var status = 'Passed'
      } else if ( project[i].last_build_status == 1 ) {
        var status = 'Failed'
      } else {
        var status = 'Stopped'
      }
      var siteName = project[i].slug.split("/").pop();
      projectName += "<li><span class='status "+status+"'><a href='https://travis-ci.org/"+project[i].slug+"'>"+status+"</a></span> | <a href='https://github.com/"+project[i].slug+"'>"+project[i].slug+"</a> | <a href='http://"+siteName+"-codeflight.surge.sh'>"+siteName+"-codeflight.surge.sh</a><br/>Last updated "+moment(project[i].last_build_finished_at).fromNow()+"</li>"
    }
  }
  list.innerHTML = projectName
  document.body.appendChild(list)
}
