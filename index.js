var config = require('./config');
var qs = require('querystring');
var xhr = require('xhr');
var cookie = require('cookie-cutter');
var githubLogin = require('./components/github-login');
var travisciLogin = require('./components/travisci-login');
var projectList = require('./components/project-list');
var logout = require('./components/logout');
var welcome = require('./components/welcome');
var createNewProject = require('./components/create-new-project');

function start() {
  "use strict";
  //we grab the GitHub URI redirect code
  var code = githubLogin.getCode(), //Github code
    token = cookie.get('github-api-access-token'), //Github API token
    travisToken = cookie.get('travis-api-access-token'); //TravisCI API token

  //If GitHub API token is present
  if (token) {
    welcome.getGithubProfile(token, function (err, profile) {
      //render Welcome message with users name
      welcome.renderWelcomeMessage(profile);
      //render a list of projects from travisCI api
      projectList.getProjectList(travisToken, profile, function (err, project) {
        projectList.renderProjectList(project);
      });
    });
    logout.logoutButton();
    //render the form to create a new repo
    createNewProject.renderNewProjectForm(token, travisToken);
    //if travisCI API token doesn't exist, go get it and save it as cookie
    if (!travisToken) {
      //add link for users who have never authed into travisCI
      travisciLogin.getTravisToken(token, function (err, cb) {
        cookie.set('travis-api-access-token', cb);
        //window.location = window.location.origin
      });
    }

  //if Github API token doesnt exist, go get it and save it as cookie
  } else if (code) {
    githubLogin.getToken(code, function (err, token) {
      cookie.set('github-api-access-token', token);
      window.location = window.location.origin;
    });

  //if no github code or api token, then render the login page
  } else {
    githubLogin.loginForm();
  }
}

//Run everything
start();
