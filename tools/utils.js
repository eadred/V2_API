/**
 * Created by arikb on 22/09/2016.
 */
var rp = require('request-promise');
var Q = require('q');
var _ = require('lodash');
var reqList = [];

var google = require('googleapis');
var cloudresourcemanager = google.cloudresourcemanager('v1');
let serviceusage = google.servicemanagement('v1')

function loadFromFile(filename) {
    var fs = require('fs');
    var file = filename;
    var newdata = fs.readFileSync(file, 'utf8');
    return newdata;
};


function simpleReq(requestOptions, auth) {
    var re = null;
    var auth = "Basic " + new Buffer(auth.username + ":" + auth.password).toString("base64");
    requestOptions.headers['Authorization'] = auth;
    // replace the url in case of v2 api.

    return insertNewReq(requestOptions).then(function (data) {
        return data;
    }, function (reason) {
        if (reason.statusCode == 504) {
            requestOptions.resolveWithFullResponse = false;
            logger.warn('got error trying to perform request: ' + JSON.stringify(requestOptions));
            logger.warn('error was: ' + JSON.stringify(reason));
            logger.warn('retrying request');
            return insertNewReq(requestOptions);
        } else {
            throw reason;
        }
    })
}

function sendRequest(requestOptions, target) {
    var re = null;
    var auth = "Basic " + new Buffer(template.apiKey.id + ":" + template.apiKey.secret).toString("base64");
    requestOptions.headers['Authorization'] = auth;
    // replace the url in case of v2 api.

    requestOptions.url = "https://api.dome9.com/v2/" + target;
    return insertNewReq(requestOptions).then(function (data) {
        return data;
    }, function (reason) {
        if (reason.statusCode == 504) {
            requestOptions.resolveWithFullResponse = false;
            logger.warn('got error trying to perform request: ' + JSON.stringify(requestOptions));
            logger.warn('error was: ' + JSON.stringify(reason));
            logger.warn('retrying request');
            return insertNewReq(requestOptions);
        } else {
            throw reason;
        }
    })
}

var insertNewReq = function (reqOpts) {
    var deferred = Q.defer();

    reqList.push({
        data: reqOpts,
        deferred: deferred
    });

    return deferred.promise;

};

function buildSrl() {
    var requestOptions = {
        reqOpts: {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        }
    };
    return sendRequest(requestOptions.reqOpts, "cloudsecuritygroup/" + template.sgId).then(function (data) {
        data = JSON.parse(data);
        if (_.find(data.services.inbound, {"id": template.serviceId})) {
            var srl = "1|" + data.cloudAccountId + "|rg|" + regionMap(data.regionId) + "|sg|" + data.securityGroupId + "|" + template.serviceId;
            return Q.resolve(srl);
        }
        else {
            return Q.reject(new Error("Service ID " + template.serviceId + "does not exist in security group " + template.sgId))
        }
    })
}

function regionMap(region) {
    switch (region) {
        case "us_east_1":
            return "0";
        case "us_west_1":
            return "1";
        case "eu_west_1":
            return "2";
        case "ap_southeast_1":
            return "3";
        case "ap_northeast_1":
            return "4";
        case "us_west_2":
            return "5";
        case "sa_east_1":
            return "6";
        case "az_1_region_a_geo_1":
            return "7";
        case "az_2_region_a_geo_1":
            return "8";
        case "az_3_region_a_geo_1":
            return "9";
        case "ap_southeast_2":
            return "10";
        case "mellanox_region":
            return "11";
        case "us_gov_west_1":
            return "12";
        case "eu_central_1":
            return "13";
        case "ap_northeast_2":
            return "14";
        case "ap_south_1":
            return "15";
    }
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var intervalID = global.setInterval(function () {
    var currentReq = reqList.shift();
    if (currentReq) {
        //console.log('currentReq',currentReq)
        rp(currentReq.data).then(function (data) {
            this.deferred.resolve(data);
        }.bind(currentReq), function (reason) {
            this.deferred.reject(reason);
        }.bind(currentReq));
    }


}, 1500);

function enableService(params) {
    return Q.nfcall(serviceusage.services.enable.bind(serviceusage.services), params)
        .then(function(){
            console.log(`${params.serviceName} enabled`);
        })
}


module.exports = {
    sendRequest: sendRequest,
    loadFromFile: loadFromFile,
    buildSrl: buildSrl,
    simpleReq: simpleReq,
    clone: clone,
    enableService: enableService
}