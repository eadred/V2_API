/**
 * Created by arik.blumin on 5/4/2016.
 */
var cookieParser = require('cookie');
var Q = require("q");
var request = require('request');
var rp = require('request-promise');
var globals = require('./globals');
var _ = require('lodash');
var collectedCookies, parameters, logger;
var proxy = process.env.http_proxy ? process.env.http_proxy : undefined;
//var conf = JSON.parse(loadFromFile('./configuration/conf.json'));
var dome9ReqList = [];
var env = globals.env;
var env = _.find(process.argv, function (argument) {
  return _.startsWith(argument, '--env=');
});
var async = require("async");
console.log(env)

env = env && env.split('--env=')[1];
console.log(env)

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
    url: localConf.baseUrl + '/account/logon',
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

      globals.dome9AuthenticationCookies = collectedCookies;
      deferred.resolve();
    }

  });

  return deferred.promise;
}

function doSecondRequest(collectedCookies, parameters, logger, username, password) {
  var deferred = Q.defer();
  var reqOpts = {
    url: localConf.baseUrl + '/account/logon',
    proxy: proxy,
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
      'Content-Type': "application/x-www-form-urlencoded",
      'Referer': localConf.baseUrl + '/account/logon'
    }
  };

  reqOpts = addCookies(reqOpts, collectedCookies, logger);
  reqOpts.body = 'UserName=' + encodeURIComponent(username) + '&Password=' + encodeURIComponent(password);
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

function doLogin(collectedCookies, parameters, logger, username, password) {
  // doing logon
  return doFirstRequest(collectedCookies, parameters, logger).then(function () {
    return doSecondRequest(collectedCookies, parameters, logger, username, password);
  });
}

exports.doLogin = function (collectedCookies, parameters, logger, username, password) {
  return doLogin(collectedCookies, parameters, logger, username, password);
};

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


