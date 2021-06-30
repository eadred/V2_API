var utils = require('./utils')
var program = require('commander');

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

program
    .option('-i, --id <id>', 'API key ID for Dome9')
    .option('-s, --secret <secret>', 'API key secret for Dome9')
    .parse(process.argv);


var auth = {
    username: program.id,
    password: program.secret
};

// var d9Url = `https://api.dome9.com/v2/GoogleCloudAccount`;
var d9Url = `https://api.eu1.dome9.com/v2/GoogleCloudAccount`;

let options = {
    url: d9Url,
    method: 'GET',
    headers: {
        'Accept': 'application/json, text/plain, */*'
    }
};

(async () => {
    try {
        res = await utils.simpleReq(options, auth)
        console.log('Got result')
        console.log(JSON.stringify(res))
    } catch (err) {
        console.log('Error')
        console.log(JSON.stringify(err))
    }
    
})().then(() => process.exit(0));