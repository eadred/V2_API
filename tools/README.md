# **ACCESS LEASE INVITATION TOOL FOR MULTIPLE USERS** #
A tool to send lease invitation for multiple users based on V2 API.


## Requirements ##
* NodeJs stable version 4.3.2 or later.
( Can be Download <a href="https://nodejs.org">here</a> )

## Installation ##
1 Clone this repo into your local machine

```git clone https://github.com/Dome9/V2_API.git```

2 Navigate to the tools folder:

```cd tools```

3 Install the tool's dependencies and register it:

```npm install -g```

NOTE: This will also register the tool so it is accessible globally.
it is possible to run the tool without globally registering it.
In this case just omit the ```-g``` param and run the tool with ```node```:
```node lease --help```


## How to run ##
### If the tool is *not* globally installed ###
1.  Using console, navigate to  tools directory.
2. run the command ```node lease --help``` to understand the command line arguments, and for each command run ```node lease <command> --help``` for example - ```node lease invite --help```

### If the tool is globally installed ###
run the command ```lease --help``` to understand the command line arguments, and for each command run ```lease <command> --help``` for example - ```lease invite --help```


### Available commands ###

* invite : Invite different user to acquire new lease.

### Command Line arguments ###
* -j or --json JSON : The path with for the JSON file (**required**):

    ```json
    {
      "apiKey":'object',
      "message":"string",
      "sgId":"string",
      "serviceId":"string",
      "experation":"string",
      "duration": "string",
      "users":"array"
    }
    ```
    * apiKey(object): ```{
                           "id":"your_API_ID",
                            "secret":"your_API_secret"
                         }``` 
                         object with v2 api key.
    * message(string): A message in the email body.
    * sgId(string): AWS Security Group id.
    * serviceId(string): The service ID is composed of the protocol and the port by the next structure "protocol-port" ,for example the service ID of ssh is "6-22" (TCP-6 and port 22), you can check <a href="https://en.wikipedia.org/wiki/List_of_IP_protocol_numbers">here</a> the protocol numbers.
    * expiration(string): Expiration time of the invitation "1h" for 1 hour, "1d" for 1 day and "1w" for 1 week.
    * duration(string): Lease duration time in the next format "hh:mm:ss".
    * users(array): Array of emails address to send the invitations (such as [userMail@gmail.com, userMail1@gmail.com, userMail2@gmail.com])
    


An example of how to make an invitation:
```lease invite -j ./template.json```

see the file _template.json_ as a JSON example.





