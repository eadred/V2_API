/**
 * Created by arik.blumin on 5/4/2016.
 */
var cookieParser = require('cookie');
var Q = require("q");
var winston = require('winston');
var request = require('request');
var utils = require('./utils');

var _ = require('lodash');
var collectedCookies, parameters, logger;
var proxy = process.env.http_proxy ? process.env.http_proxy : undefined;

function addCookie(collectedCookies, cookie) {
  var cookieFlag = false;
  var nameCookie = cookie[0].split(";")[0].split("=")[0];
  for (var cookieIdx = 0; cookieIdx < collectedCookies.length; cookieIdx++) {
    if (collectedCookies[cookieIdx][0].indexOf(nameCookie) >= 0) {
      collectedCookies[cookieIdx] = cookie;
      cookieFlag = true;
    }
  }
  if (cookieFlag === false) {
    collectedCookies.push(cookie);
  }
}

exports.addCookie = function (collectedCookies, cookie) {
  return addCookie(collectedCookies, cookie);
}

function addCookies(reqOpts, collectedCookies, logger) {
  for (var cookieIdx = 0; cookieIdx < collectedCookies.length; cookieIdx++) {
    var cookieDomain = cookieParser.parse(collectedCookies[cookieIdx][0]).Domain;
    if ((undefined === cookieDomain) || (("" === cookieDomain)) || (reqOpts.url.indexOf(cookieDomain) >= 0)) {
      reqOpts.headers = reqOpts.headers || {};
      if (undefined !== reqOpts.headers['Cookie'])
        reqOpts.headers['Cookie'] = reqOpts.headers['Cookie'] + collectedCookies[cookieIdx][0].split(";")[0] + ";"
      else
        reqOpts.headers['Cookie'] = collectedCookies[cookieIdx][0].split(";")[0] + ";"
    }
  }
  return reqOpts;
}

exports.addCookies = function (reqOpts, collectedCookies, logger) {
  return addCookies(reqOpts, collectedCookies, logger);
}

function doFirstRequest(collectedCookies, parameters, logger) {
  var deferred = Q.defer();

  var reqOpts = {
    url: utils.url+'account/logon',
    proxy: proxy,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
    }
  };

  request(reqOpts, function (err, res, body) {
    if (err) {
      logger.error('request on url %s error %s %s', reqOpts.method, reqOpts.url, JSON.stringify(err));
      deferred.reject(err);
    }
    else if (undefined !== res) {
      logger.info('Processing request for tokens in Cookies...%s %s', reqOpts.method, reqOpts.url);

      if ((res.statusCode === 304) || (res.statusCode === 302) || (res.statusCode === 200)) {
        logger.info('status Response ok:', res.statusCode);
      }
      else {
        logger.error('status Response is NOT ok - ', res.statusCode);
      }

      if ((undefined !== res.headers) && (undefined !== res.headers['set-cookie'] )) {
        addCookie(collectedCookies, res.headers['set-cookie']);
      }
      if ((undefined !== res.headers) && (undefined !== res.headers['Set-Cookie'] )) {
        addCookie(collectedCookies, res.headers['Set-cookie']);
      }

      deferred.resolve();
    }

  });

  return deferred.promise;
}

function doSecondRequest(collectedCookies, parameters, logger, username, password,mfa) {
  var deferred = Q.defer();
  var reqOpts = {
    url: utils.url+'account/logon',
    proxy: proxy,
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
      'Content-Type': "application/x-www-form-urlencoded",
      'Referer': utils.url+'account/logon'
    }
  };

  reqOpts = addCookies(reqOpts, collectedCookies, logger);
  if (mfa) reqOpts.body = 'UserName=' + encodeURIComponent(username) + '&Password=' + encodeURIComponent(password) + '&mfa=on&MfaToken=' + mfa;
  else reqOpts.body = 'UserName=' + encodeURIComponent(username) + '&Password=' + encodeURIComponent(password);
  request(reqOpts, function (err, res, body) {
    if (err) {
      logger.error('request on url %s error %s %s', reqOpts.method, reqOpts.url, JSON.stringify(err));
      deferred.reject(err);
    }
    else if (undefined !== res) {
      logger.info('Processing request for tokens in Cookies...%s %s', reqOpts.method, reqOpts.url);

      if ((res.statusCode === 304) || (res.statusCode === 302) || (res.statusCode === 200)) {
        logger.info('status Response ok:', res.statusCode);
      }
      else {
        logger.error('status Response is NOT ok - ', res.statusCode);
      }

      if ((undefined !== res.headers) && (undefined !== res.headers['set-cookie'] )) {
        addCookie(collectedCookies, res.headers['set-cookie']);
      }
      if ((undefined !== res.headers) && (undefined !== res.headers['Set-Cookie'] )) {
        addCookie(collectedCookies, res.headers['Set-cookie']);
      }
      logger.info("log-in is done");
      deferred.resolve();
    }

  });
  return deferred.promise;
}

function doLogin(collectedCookies, parameters, logger, username, password,mfa) {
  // doing logon
  return doFirstRequest(collectedCookies, parameters, logger).then(function () {
    return doSecondRequest(collectedCookies, parameters, logger, username, password,mfa);
  });
}

exports.doLogin = doLogin;

function basicRequestProcess(err, res, body, collectedCookies, parameters, logger, reqOpts) {

  if (err) {
    logger.error('request on url %s error %s %s', reqOpts.method, reqOpts.url, JSON.stringify(err));
    return err;
  }
  else if (undefined !== res) {
    logger.info('Processing request...%s %s', reqOpts.method, reqOpts.url);

    if ((res.statusCode === 304) || (res.statusCode === 302) || (res.statusCode === 200)) {
      logger.info('status Response  ok');
    }
    else {
      logger.error('status Response is NOT ok - ', res.statusCode);
      return (new Error('status Response is NOT ok - ', res.statusCode));
    }
    if ((undefined !== res.headers) && (undefined !== res.headers['set-cookie'] )) {
      addCookie(collectedCookies, res.headers['set-cookie']);
    }
    if ((undefined !== res.headers) && (undefined !== res.headers['Set-Cookie'] )) {
      addCookie(collectedCookies, res.headers['Set-cookie']);
    }
  }
  return;
}


exports.basicRequestProcess = function (err, res, body, collectedCookies, parameters, logger, reqOpts) {
  return basicRequestProcess(err, res, body, collectedCookies, parameters, logger, reqOpts);
}

function RequestOptions(url, method, body,xsrf) {
  this.reqOpts = {
    //url: 'https://' + utils.getConfiguration().username + ':' + utils.getConfiguration().APIKey +
    //'@'+  utils.getConfiguration().baseAPIUrl + 'titan-leases/f7b335e1-82bf-4166-a94e-8f8eb4a4e6c8?format=json;',
    url: url,
    proxy: proxy,
    method: method,
    json: body,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'X-XSRF-TOKEN': xsrf
    }
  }
}
exports.RequestOptions = RequestOptions;

exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({stderrLevels: ['error', 'debug', 'info', 'warn'], level: 'debug'}) // in this CLI tool - we'll write all logs to STDERR except the resutl of the tool.
  ]
})

exports.v2Url = "https://secure.dome9.com/api/";

exports.url = "https://secure.dome9.com/";