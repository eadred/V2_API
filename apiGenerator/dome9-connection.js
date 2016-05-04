/**
 * Created by arik.blumin on 5/4/2016.
 */
var logger = require('winston');
var utils = require('./utils');
var rp = require('request-promise');
var Q = require('q');
var _ = require('lodash');
var globals = require('./../../globals');

function Dome9Connection(username, password){
  this.username = username;
  this.password = password;
  this.loginPromise = null;
  this.authenticationCookie = [];
  this.xsrfToken = null;
}

Dome9Connection.prototype.login = function(){
  var self = this;

  this.loginPromise = utils.doLogin(self.authenticationCookie, {}, logger, this.username, this.password).then(function () {
  }, function (error) {
    throw 'Failed to login\n' + 'original massage: \n' + error;
  }).then(function(){
    var v2AppRequestOptions = {
      url: 'https://api.dome9.com/cloudaccounts' ,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      json: true,
      resolveWithFullResponse: true
    };

    v2AppRequestOptions = utils.addCookies(v2AppRequestOptions, self.authenticationCookie, logger);


    return this.requestV2WebApi(v2AppRequestOptions)
      .then(function(v2App){
        var re = /XSRF-TOKEN=(.*); path=\//;

        var xsrfToken = _.find(v2App.headers['set-cookie'], function(item){
          return re.test(item);
        });
        if(v2App.body[0]) globals.accountId=v2App.body[0].id;
        if(xsrfToken){
          self.xsrfToken = re.exec(xsrfToken)[1];
        }
      })

  });

  return this.loginPromise;
};

Dome9Connection.prototype.requestV2WebApi = function(requestOptions){
  if(!this.loginPromise){
    this.login();
  }

  return this.loginPromise.then(function(){
    requestOptions = utils.addCookies(requestOptions, this.authenticationCookie, logger);
    requestOptions.headers = requestOptions.headers || {};
    requestOptions.headers['X-XSRF-TOKEN'] = this.xsrfToken;
    requestOptions.resolveWithFullResponse = true;
    return rp(requestOptions).then(function(data){
      return data.body;
    }, function(reason){
        throw reason;
    });
  }.bind(this),function(err){
    console.log('failed to login',err);
    throw err;
  });
};

module.exports = Dome9Connection;