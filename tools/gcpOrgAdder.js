var utils = require('./utils')
var program = require('commander');
program
  .option('-p, --path <path>', 'service account key path for google cloud account')
  .option('-i, --id <id>', 'API key ID for Dome9')
    .option('-c, --compute <compute>', 'compute?')
  .option('-s, --secret <secret>', 'API key secret for Dome9')
  .parse(process.argv);

var mustService = 'cloudresourcemanager.googleapis.com';

const services = [
    'iam.googleapis.com',
    'cloudkms.googleapis.com'
];

console.log(program.path)
var google = require('googleapis');
var cloudresourcemanager = google.cloudresourcemanager('v1');
let serviceusage = google.servicemanagement('v1')
// First I want to read the file
var key = require(program.path);
var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/service.management'],
  null
);
if(program.compute === 'true' || !program.compute) program.compute = true;
else if(program.compute === 'false') program.compute = false;
else if(program.compute && program.compute !== 'true' && program.compute !== 'false') throw 'error: invalid compute param';
var auth = {
  username : program.id,
  password : program.secret
};
var d9Url = `https://qa_api.falconetix.com/v2/GoogleCloudAccount?skipComputeValidation=${!program.compute}`;

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  }
  var request = {
    // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
    // Auth client
    auth: jwtClient
  };

    var mainRequestForService = {
        // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
        // Auth client
        auth: jwtClient
    };
  // Make an authorized request to list Drive files.
  var recur = function(err, result) {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      var counter=0;
      var withFailure = false;
      result.projects.forEach(function(acc){
          let requestForService = {
              // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
              // Auth client
              auth: jwtClient
          };
        //service name has already init
          requestForService.serviceName = 'cloudresourcemanager.googleapis.com';
          requestForService.consumerId = `project:${acc.projectId}`;
          serviceusage.services.enable(requestForService, function(res0) {
              if (res0 && res0.errors && res0.errors.length) {
                  console.error(`project:${acc.projectId} failed`, res0.errors[0].message)
              }
              else{
                  console.log(`project:${acc.projectId} - ${requestForService.serviceName} enabled`);
                  requestForService.serviceName = 'iam.googleapis.com';
                  serviceusage.services.enable(requestForService, function(res0){
                      if(res0 && res0.errors && res0.errors.length) {
                          console.error(`project:${acc.projectId} failed`, res0.errors[0].message)
                      }
                      else {
                          console.log(`project:${acc.projectId} - ${requestForService.serviceName} enabled`);
                          requestForService.serviceName = 'cloudkms.googleapis.com';
                          serviceusage.services.enable(requestForService, function(res){
                              if(res && res.errors && res.errors.length) {
                                  console.error(`project:${acc.projectId} failed`, res.errors[0].message)
                              }
                              else {
                                  console.log(`project:${acc.projectId} - ${requestForService.serviceName} enabled`);
                                  var currentKey = utils.clone(key);
                                  currentKey.project_id = acc.projectId;
                                  console.log('adding project: ',currentKey.project_id);
                                  var options = {
                                      url: d9Url,
                                      method: 'POST',
                                      body: {
                                          name:currentKey.project_id,
                                          serviceAccountCredentials: currentKey
                                      },
                                      headers: {
                                          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
                                          'Content-Type': 'application/json; charset=UTF-8',
                                          'Accept': 'application/json, text/plain, */*'
                                      },
                                      json: true
                                  };
                                  utils.simpleReq(options,auth).then(function(res){
                                      counter++;
                                      console.log('Project added successfully',res);
                                  })
                                      .catch(function(err){
                                          counter++;
                                          withFailure = true;
                                          console.error(err.error);
                                      })
                                      .finally(function(){
                                          if(counter == result.projects.length && !withFailure){
                                              process.exit(0)
                                          }
                                          else if(counter == result.projects.length && withFailure){
                                              process.exit(1)
                                          }
                                      })
                              }
                          })
                      }
                  });
              }
          });


      });
      if (result.nextPageToken) {
        request.pageToken = result.nextPageToken;
        cloudresourcemanager.projects.list(request, recur);
      }
    }
  };


    mainRequestForService.serviceName = 'cloudresourcemanager.googleapis.com';
    mainRequestForService.consumerId = `project:${key.project_id}`;


    serviceusage.services.enable(mainRequestForService, function(res){
        if(res && res.errors && res.errors.length) {
            console.error(`on-boarding failed project:${key.project_id}`, res.errors[0].message);
        }
        else cloudresourcemanager.projects.list(request, recur);
    });
});
