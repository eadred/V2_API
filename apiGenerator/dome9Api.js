#!/usr/bin/env node
/**
 * Created by arik.blumin on 4/6/2016.
 */
var Q = require('q');
var utils = require('./utils.js');
var program = require('commander');
var logger = utils.logger;
var Dome9connection = require('./dome9-connection.js');
var Api=require('./apiV2.js');


// Redirect all console log messages into the standard error. in order to use the standard out for the tools result.
// Note - this is also implemented in the winston logging - but implemented here too since there are occurences of console.log in the code.
console.log = console.error;
console.info = console.error;
console.warn = console.error;

program
  .command('get')
  .description('Get the existing API keys of the user ')
  .option('-u, --username <username>', 'Dome9 username')
  .option('-p, --password <password>', 'Dome9 password')
  .option('-m, --mfa <mfa>', 'mfa')
  .action(function(commands){
    //var login={
    //  username:'',
    //  password:'',
    //  mfa: undefined
    //};
    //var path = program.file;
    //login.password= commands.password;
    //login.username= commands.username;
    //login.mfa= commands.mfa;
    var dome9Connection = new Dome9connection(commands.username,commands.password,commands.mfa);
    var api = new Api.V2Api(dome9Connection);
    api.get('me')
      .then(function(data){
        logger.info(data);
        process.exit(0);
      },function(err){
        logger.info(err);
        process.exit(1);
      },function(err){
        logger.info(err);
      })

  });

program
  .command('create')
  .description('Add new AWC account')
  .option('-u, --username <username>', 'Dome9 username')
  .option('-p, --password <password>', 'Dome9 password')
  .option('-m, --mfa <mfa>', 'mfa')
  .action(function(commands){

    var login={
      username:'',
      password:'',
      mfa: undefined,
      arn:'',
      erxternalId:''
    };
    login.password= commands.password;
    login.username= commands.username;
    login.mfa= commands.mfa;
    login.arn= commands.arn;
    login.erxternalId= commands.erxternalId;
    login.name= commands.name;
    var dome9connection = new Dome9connection(true,login.username, login.password, null,login.mfa);
    var account = new Account.Account(dome9connection);
    account.addAwsAccount(login.arn,login.erxternalId,"RoleBased",false,login.name)
      .then(function(data){
        logger.info('aws account has been added successfully');
        process.exit(0);
      },function(err){
        logger.info('failed to add aws account: '+err);
        process.exit(1);
      })
  });


program.parse(process.argv);



