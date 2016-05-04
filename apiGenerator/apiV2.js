/**
 * Created by arik.blumin on 3/31/2016.
 */
var Q = require("q");
var winston = require('winston');
var logger = winston;
var accountId;
var proxy = process.env.http_proxy ? process.env.http_proxy : undefined;
var collectedCookies = {collectedCookies: []};
var globals = require('./../../globals');
var parameters = {parameters: {}};
var utils = require('./../../utils.js');
var request = require('request');
var moment = require('moment');
var _ = require('lodash');
var xsrf = null;
var isParallel = false;



V2Api.prototype.create = function (userId) {
  //var deferred = Q.defer();
  var conf = new utils.Conf();

  var urlC = conf.baseUrl + '/api/user/'+userId+'/api-key'
  var requestOptions =new globals.RequestOptions(urlC,'POST',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};
V2Api.prototype.get = function (userId) {
  //var deferred = Q.defer();
  var conf = new utils.Conf();

  var urlC = conf.baseUrl + '/api/user/'+userId+'/api-key'
  var requestOptions =new globals.RequestOptions(urlC,'GET',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};

V2Api.prototype.delete = function (userId,keyId) {
  //var deferred = Q.defer();
  var conf = new utils.Conf();

  var urlC = conf.baseUrl + '/api/user/'+userId+'/api-key/'+keyId
  var requestOptions =new globals.RequestOptions(urlC,'DELETE',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};

function V2Api (dome9Connection){
  this.connection=dome9Connection;
}

module.exports = {
  V2Api:V2Api
}