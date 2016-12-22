// console.js
// var exportst = module.exports = {};
var config = require('../config');
var qs = require('querystring');
var xhr = require('xhr');
var yaml = require('js-yaml');

exports.renderNewProjectForm = function (token, travisToken) {
  var inputProjectName = document.createElement('input');
  inputProjectName.setAttribute("type","text");
  inputProjectName.setAttribute("id","repo_name");
  document.body.appendChild(inputProjectName);

  var btn = document.createElement('button')
  btn.innerHTML = 'Create new project'
  btn.setAttribute("id","repo_btn");
  document.body.appendChild(btn)

  btn.addEventListener('click', function (e) {
    e.preventDefault()
    exports.createNewProject(token, travisToken);
  })
}

exports.testFunc = function (token, travisToken, callback){

  var setVars = {
    url: config.gatekeeper + '/setenv/'+repoid+'/' + travisToken,
    json: true
  }

  xhr(setVars, function(err, resp) {
    if (err) return callback(err)
    console.log(resp)
    console.log('done')
  })
}

//Create new project
exports.createNewProject = function (token, travisToken, callback) {
  var repo__name = document.getElementById('repo_name').value

  //configuration for our new repo
  var optionsCreateRepo = {
    url: 'https://api.github.com/user/repos',
    json: true,
    data: {
      "name": repo__name,
      "description": "built with name",
      "auto_init": true
    },
    headers: {
      authorization: 'token ' + token,
      "Content-Type": "application/json"
    }
  }

  //configuration for our repositories index.html file
  var optionsCreateIndexFile = {
    url: 'https://api.github.com/repos/'+profileName+'/'+repo__name+'/contents/index.html?ref=master',
    json: true,
    headers: {
      authorization: 'token ' + token
    },
    data: {
      "path": "index.html",
      "name": "index.html",
      "type": "file",
      "content": "PGgxPkhlbGxvIFdvcmxkITwvaDE+",
      "message": "Create index.html"
    }
  }

  //configuration for our repositories .travis.yml file

  var travisYML = 'language: node_js\nnode_js:\n  - 0.12\nscript:\n  - echo "Welcome to CodeFlight"\ndeploy:\n  provider: surge\n  domain: '+repo__name+'-codeflight.surge.sh';
  var travisYMLEncoded = window.btoa(travisYML)


  var optionsCreateTravisFile = {
    url: 'https://api.github.com/repos/'+profileName+'/'+repo__name+'/contents/.travis.yml?ref=master',
    json: true,
    headers: {
      authorization: 'token ' + token
    },
    data: {
      "path": ".travis.yml",
      "name": ".travis.yml",
      "type": "file",
      "content": travisYMLEncoded,
      "message": "Create travis.yml"
    }
  }

  var optionsTravisSync = {
    url: 'https://api.travis-ci.org/users/sync',
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token '+travisToken,
      'Accept': 'application/vnd.travis-ci.2+json'
    },
    data: {
      "user": {
        "login": profileName
      }
    }
  }

  //get ID of new travisCI repo instance
  var getTravisRepoID = {
    url: 'https://api.travis-ci.org/repos/'+profileName+'/'+repo__name,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token '+travisToken,
    }
  }



  //create a new repository
  xhr.post(optionsCreateRepo, function(err, resp) {
    if (err) return callback(err)
    console.log('New Repo Created')

    //add new .travis.yml file to the repo
    xhr.put(optionsCreateTravisFile, function(err, config) {
      if (err) return callback(err)
      console.log('Added travis.yml')

        //sync travis to detect new repo
        xhr.post(optionsTravisSync, function(err, resp, cb) {
          if (err) return callback(err)
          //callback(null, cb)
          /*
          var continue = false
          if (!coninue) {
            function get user info
            if is_syncing = false {
              continue = true
            }
          }
          else {
            continue callbacks
          }
          */
          //console.log(cb)
          console.log('Synced Travis')
          //get user info, check if syncing = false, then continue
          //we set timeout befor runnng the next callback to give travis time to sync
          setTimeout(function(){
          //get travisci project id
          xhr.get(getTravisRepoID, function(err, repoconfig) {
            if (err) return callback(err)
            console.log('Fetched Travis Repo ID')

            var builtRepoId = repoconfig.body.id
            var optionsTravisActivate = {
              url: 'https://api.travis-ci.org/hooks',
              json: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token '+travisToken,
              },
              data : {
                "hook": {
                  "id": builtRepoId,
                  "active": true
                }
              }
            }
            //activate our new repository
            xhr.put(optionsTravisActivate, function(err, resp, cb) {
              if (err) return callback(err)
              //console.log(cb)
              console.log('Activated the repo')

              var setVars = {
                url: 'http://localhost:9999/setenv/'+builtRepoId+'/' + travisToken,
                json: true
              }

              xhr(setVars, function(err, resp) {
                if (err) return callback(err)
                console.log('Added environment variables')

                //add new index.html file to the repo
                xhr.put(optionsCreateIndexFile, function(err, content) {
                  if (err) return callback(err)
                  console.log('Added index.html')

                  //add new travis.yml without surge --add
                })
              })
            })
          })
        }, 15000)
      })
    })
  })
}
