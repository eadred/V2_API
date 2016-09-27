/**
 * Created by arikb on 22/09/2016.
 */

var utils = require('./utils.js');
var program = require('commander');
var moment = require('moment');
var Q = require('q');
var executed = false;

moment().format();
logger = require('winston');
logger.add(logger.transports.File, { filename: 'lease.log' });
logger.info('init...')

// Redirect all console log messages into the standard error. in order to use the standard out for the tools result.
// Note - this is also implemented in the winston logging - but implemented here too since there are occurences of console.log in the code.



program
  .command('invite')
  .description('invite users')
  .option('-j, --json <json>', 'data json')
  .action(function (commands) {
    executed = true;
    if (!commands.json) {
      logger.error('missing -j, --json, a required option');
      process.exit(1);
    }
    else {
      global.template = JSON.parse(utils.loadFromFile(commands.json));
      buildInvetantion(commands.json)
        .then(function (data) {
          logger.info(data);
          process.exit(0);
        }, function (err) {
          logger.error(err)
          process.exit(1);
        })
    }

  });



program.parse(process.argv);

function buildInvetantion(jsonName) {
  var promises =[];
  return utils.buildSrl().then(function(srl){
    template.users.forEach(function(user){
      var now = new moment();

      switch (template.expiration){
        case "1h":
          now.add(1, 'h');
          break;
        case "1d":
          now.add(1,'d');
          break;
        case "1w":
          now.add(1,'w');
          break;
        default:
          now.add(1,'d');
          break;
      }
      var reqJson={
        method: 'POST',
        json:{
          body: template.message || "",
          notifyEmail: user,
          length: template.duration,
          recipientName: user,
          targetSrl: srl,
          expirationTime:now.toISOString()
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      }
      promises.push(utils.sendRequest(reqJson,"AccessLeaseInvitation"))
    })
    return Q.all(promises);
  })

}

if(!executed){
  program.help();
}
