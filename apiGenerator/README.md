
## Requirements ##
* NodeJs stable version 4.3.2 or later. 
( Can be Download <a href="https://nodejs.org">here</a> )

## Installation ##
1 Clone this repo into your local machine

```git clone https://github.com/Dome9/V2_API.git```

2 Navigate to the apiGenerator folder:

```cd apiGenerator``` 

3 Install the tool's dependencies:

```npm install -g```

## How to run ##

1. Using console, navigate to  apiGenerator directory.

2. run the command ```apiGenerator --help``` to understand the command line commands, and for each command run the command ```apiGenerator <command> --help``` for example - ```apiGenerator create --help```


### Command Line commands ###

* get : get your current API keys.
* create : create new API key.
* delete : delete the API key.

#### Command Line commands ####
* -u or --username USERNAME : your Dome9 username (email,required)
* -p or --password PASSWORD : your Dome9 password (required)
* -m or --mfa MFA : For users with MFA. 
* -i or --id : The API Key ID, relevant for the 'delete' command (required).


An example of how to generate API key:
```apiGenerator  create -u me@acme.com -p mypass```

