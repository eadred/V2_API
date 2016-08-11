#!/usr/bin/env node
/**
 * Created by arik.blumin on 4/6/2016.
 */
var Q = require('q');
var utils = require('./utils.js');
var program = require('commander');
var logger = utils.logger;
var Dome9connection = require('./dome9-connection.js');
var Api = require('./apiV2.js');


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
    .action(function (commands) {
        if(!commands.username){
            logger.error('missing -u, --username, a required option');
            process.exit(1);
        }
        else if(!commands.password){
            logger.error('missing -p, --password, a required option');
            process.exit(1);
        }
        else{
            var dome9Connection = new Dome9connection(commands.username, commands.password, commands.mfa);
            var api = new Api.V2Api(dome9Connection);
            api.get('me')
                .then(function (data) {
                    process.stdout.write(data);
                    process.exit(0);
                }, function (err) {
                  console.error(err.error);
                    process.exit(1);
                }, function (err) {
                    logger.info(err);
                })
        }

    });

program
    .command('create')
    .description('Create a new Dome9 V2 API key')
    .option('-u, --username <username>', 'Dome9 username')
    .option('-p, --password <password>', 'Dome9 password')
    .option('-m, --mfa <mfa>', 'mfa')
    .action(function (commands) {
        if(!commands.username){
            logger.error('missing -u, --username, a required option');
            process.exit(1);
        }
        else if(!commands.password){
            logger.error('missing -p, --password, a required option');
            process.exit(1);
        }
        else{
            var dome9Connection = new Dome9connection(commands.username, commands.password, commands.mfa);
            var api = new Api.V2Api(dome9Connection);
            api.create('me')
                .then(function (data) {
                    process.stdout.write(data);
                    process.exit(0);
                }, function (err) {
                    logger.info(err);
                    process.exit(1);
                }, function (err) {
                    logger.info(err);
                })
        }
    });

program
    .command('delete')
    .description('Delete existing Dome9 V2 api key')
    .option('-i, --id <id>', 'The API Key ID')
    .option('-u, --username <username>', 'Dome9 username')
    .option('-p, --password <password>', 'Dome9 password')
    .option('-m, --mfa <mfa>', 'mfa')
    .action(function (commands) {
        if(!commands.username){
            logger.error('missing -u, --username, a required option');
            process.exit(1);
        }
        else if(!commands.password){
            logger.error('missing -p, --password, a required option');
            process.exit(1);
        }
        else if(!commands.id){
            logger.error('missing -i, --id, a required option');
            process.exit(1);
        }
        else{
            var dome9Connection = new Dome9connection(commands.username, commands.password, commands.mfa);
            var api = new Api.V2Api(dome9Connection);
            api.delete('me',commands.id)
                .then(function (data) {
                    process.stdout.write(data);
                    process.exit(0);
                }, function (err) {
                    logger.info(err);
                    process.exit(1);
                }, function (err) {
                    logger.info(err);
                })
        }
    });


program.parse(process.argv);



