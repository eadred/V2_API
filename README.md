#DOME9 API#

The Dome9 API enables developers to access Dome9 functionality by an API key.
  This describes resourses are currently in a beta version:

##URL

The url to make the requests is https://api.dome9.com/

##Authorization

The authorization make with an API key, which generate by an automatic tool, by inserting it as Basic Authentication.
 the "id" is the username and the "API Key Secret" is the password.

##Supported features
 
1. [AWS Security Groups](#aws-security-groups)

2. [AWS Accounts](#aws-accounts)

3. [IP Lists](#ip-lists)






##<a name="aws-security-groups">AWS Security Groups</a>

###GET 

```json
 {
   "securityGroupId": 0,
   "externalId": "string",
   "isProtected": true,
   "securityGroupName": "string",
   "vpcId": "string",
   "regionId": "us_east_1",
   "cloudAccountId": "string",
   "cloudAccountName": "string",
   "services": {},
   "tags": {}
 }
```

###addoutboundservice



##<a name="aws-accounts">AWS Accounts</a>

##<a name="ip-lists">IP Lists</a>
