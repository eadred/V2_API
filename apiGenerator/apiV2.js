/**
 * Created by arik.blumin on 3/31/2016.
 */


var collectedCookies = {collectedCookies: []};
var utils = require('./utils.js');
var _ = require('lodash');
var xsrf = null;



V2Api.prototype.create = function (userId) {

  var urlC = 'https://api.dome9.com/v2/user/'+userId+'/api-key'
  var requestOptions =new utils.RequestOptions(urlC,'POST',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};
V2Api.prototype.get = function (userId) {

  var urlC = 'https://api.dome9.com/v2/user/'+userId+'/api-key'
  var requestOptions =new utils.RequestOptions(urlC,'GET',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};

V2Api.prototype.delete = function (userId,keyId) {

  var urlC = 'https://api.dome9.com/v2/user/'+userId+'/api-key/'+keyId;
  var requestOptions =new utils.RequestOptions(urlC,'DELETE',null,xsrf);

  return this.connection.requestV2WebApi(requestOptions.reqOpts)


};

function V2Api (dome9Connection){
  this.connection=dome9Connection;
}

module.exports = {
  V2Api:V2Api
}