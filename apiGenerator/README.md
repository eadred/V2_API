# DOME9 API KEYS MANAGEMENT UTILITY #
An API keys management cli utility to manage new Dome9 V2 api keys.  
This tool will be integrated in the future into Dome9 Web console once the V2 API is generally available.

## Requirements ##
* NodeJs stable version 4.3.2 or later. 
( Can be Download <a href="https://nodejs.org">here</a> )

## Installation ##
1 Clone this repo into your local machine

```git clone https://github.com/Dome9/V2_API.git```

2 Navigate to the apiGenerator folder:

```cd apiGenerator``` 

3 Install the tool's dependencies and register it:

```npm install -g```

NOTE: This will also register the tool so it is accessible globally.  
it is possible to run the tool without globally registering it.  
In this case just omit the ```-g``` param and run the tool with ```node```:   
```node d9-api --help```


## How to run ##
### If the tool is *not* globally installed ###
1.  Using console, navigate to  apiGenerator directory.
2. run the command ```node d9-api --help``` to understand the command line arguments, and for each command run ```node d9-api <command> --help``` for example - ```node d9-api create --help```

### If the tool is globally installed ###
run the command ```d9-api --help``` to understand the command line arguments, and for each command run ```d9-api <command> --help``` for example - ```d9-api create --help```


### Available commands ###

* get : Lists al your existing API keys.
* create : create new API key.
* delete : delete the API key.

### Command Line arguments ###
* -u or --username USERNAME : your Dome9 username (email,**required**)
* -p or --password PASSWORD : your Dome9 password (**required**)
* -m or --mfa MFA : For users with MFA. 
* -i or --id : The API Key ID  (**required for the 'delete' command**).


An example of how to generate API key:
```d9-api -u me@acme.com -p mypass create```

