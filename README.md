#DOME9 V2 API#

The Dome9 API enables developers to access Dome9 functionality by using an API key.  
This is a **public preview** of the next generation Dome9 V2 api.  
While there are many more resources already implemented, the resources below are documented and validated for external usage.  
If there are any other api use-case - *please contact us* at support@dome9.com. We'll then verify and document these resources / actions.

## Getting Started

### Create and Manage V2 API keys

For creating a new API key please navigate to <a href="https://secure.dome9.com/v2/settings/credentials"> Credentials tab in My Settings</a> page.

As you can see in the screen shot below, you have a box of **V2 API**, where you can manage your API keys.

 ![Alt text](/screenshots/box.png "API V2 page")

 By clicking on **CREATE API KEY**, you will see the next popup:

  ![Alt text](/screenshots/popup.png "API V2 popup")

  Save your new API key, ID and Secret, because there is no way to recover the secret number.

* Once you have the api key, you are ready to work with the Dome9 V2 API...

* Note: The maximum number of API keys is 7.

## API End Point 

The base URL for Dome9 API V2 is:  ```https://api.dome9.com/v2/```

## Authentication 

The API is using HTTP Basic Authentication scheme.  
You'll use the api key *id* as the user name and the *apiKeySecret* as the password. 

**Example:**
```bash

me$ curl -u your-api-key-id:your-api-key-secret https://api.dome9.com/v2/CloudAccounts
[{"id":"1eeab7ac-8443-4d18-aa0b-e3201ff1d731","vendor":"aws","name":"aws prod","externalAccountNumber":"1111111111","error":null,"credentials":{"apikey":"AKIAIMLTZZXXXXXX","arn":null,"secret":null,"iamUser":null,"type":"UserBased","isReadOnly":null},"iamSafe":null,"netSec":{"regions":[...
... redacted ...

```

##Supported Resources / Actions 
 
1. [AWS Security Groups](#aws-security-groups)

2. [AWS Accounts](#aws-accounts)

3. [IP Lists](#ip-lists)

4. [Dome9 Agents](#dome9-agents)

5. [Users](#users)

##<a name="aws-security-groups">AWS Security Groups</a>
1. [GET](#aws-security-groups-get)
2. [Change Protection Mode](#aws-security-groups-protection-mode)
3. [Create Security Groups](#aws-security-groups-create)
4. [Create Service](#aws-security-groups-create-service)
5. [Overwrite Security Group](#aws-security-groups-overwrite-security-group)
6. [Overwrite service](#aws-security-groups-overwrite-service)
7. [Delete service](#aws-security-groups-delete-service)
8. [Delete Security Groups](#aws-security-groups-delete-security-groups)

<h3><a name="aws-security-groups-get">GET</a></h3> 

The GET request returns all cloud security groups, which are protected by Dome9.

URL: /CloudSecurityGroup/{groupid} <br \>
METHOD: GET <br \> <br \>
groupid: if the request is made without the security group id, then all security groups protected by Dome9 will be returned.

**Example:**
```bash
curl -u id:secret -X GET --header 'Accept: application/json' 'https://api.dome9.com/v2/cloudsecuritygroup/529900'
```

####Response:

```json
 {
   "securityGroupId": "integer",
   "externalId": "string",
   "isProtected": "boolean",
   "securityGroupName": "string",
   "vpcId": "string",
   "vpcName": "string",
   "regionId": "string",
   "cloudAccountId": "string",
   "cloudAccountName": "string",
   "services": {},
   "tags": {}
 }
```

* securityGroupId (integer): The Security Group ID in Dome9.
* externalId (string): The Security Group ID in AWS.
* isProtected (boolean, optional): will appear as "true" if the group is in "Full Protection" mode, or will appear as "false" if the group is in "Read Only" mode.
* securityGroupName (string, optional): The name of the Security Group.
* description (string, optional): The description of the Security Group.
* vpcId (string, optional): The VPC id of the Security Group.
* vpcName (string, optional): The VPC name of the Security Group.
* regionId (string, optional): Can be one of the following regions - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
* cloudAccountId (string, optional): Dome9 Cloud Account ID.
* services (object, optional) - The inbound and outbound services of the security group.
* tags (object, optional) - The security group's tags.

<h3><a name="aws-security-groups-protection-mode">Change Protection Mode</a></h3>

Change the protection mode to "Read Only" or "Full Protection".

URL: /CloudSecurityGroup/{groupId}/protection-mode <br \>
METHOD: POST <br \>
groupid: The groupid can be either the group's Dome9 internal ID or the group's AWS ID (externalId). <br \>

BODY:
```json
{
  "protectionMode": "string" /*required*/
}
```

####Request Parameters
* protectionMode(string):  can be either 'FullManage' or 'ReadOnly'

**Example:**
```bash

curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "protectionMode": "ReadOnly"
}' 'https://api.dome9.com/v2/cloudsecuritygroup/429618/protection-mode'

```

####Response:

```json
 {
   "securityGroupId": "integer",
   "externalId": "string",
   "isProtected": "boolean",
   "securityGroupName": "string",
   "vpcId": "string",
   "regionId": "string",
   "cloudAccountId": "string",
   "cloudAccountName": "string",
   "services": {},
   "tags": {}
 }
```

* securityGroupId (integer): The Security Group ID in Dome9.
* externalId (string): The Security Group ID in AWS.
* isProtected (boolean, optional): will appear as "true" if the group is in "Full Protection" mode, or will appear as "false" if the group is in "Read Only" mode.
* securityGroupName (string, optional): The name of the Security Group.
* description (string, optional): The description of the Security Group.
* vpcId (string, optional): The VPC id of the Security Group.
* regionId (string, optional): Can be one of the following regions - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
* cloudAccountId (string, optional): Dome9 Cloud Account ID.
* services (object, optional) - The security group's inbound and outbound services.
* tags (object, optional) - The security group's tags.

<h3><a name="aws-security-groups-create">Create Security Groups</a></h3>
Create a new Security Group on AWS.

URL: /CloudSecurityGroup <br \>
METHOD: POST <br \>
BODY:
```json
{
  "securityGroupName": "string",
  "description": "string",
  "vpcId": "string",
  "regionId": "string",
  "cloudAccountId": "string",
  "cloudAccountName": "string",
  "services": {
    "inbound": [
      {
        "name": "string" /*required*/,
        "id": "string",
        "description": null,
        "protocolType": "string" /*required*/,
        "port": "string" /*required*/,
        "openForAll": "boolean" /*required*/,
        "scope": [
          {
            "type": "string",
            "data": {
              "cidr": "string",
              "note": null
            }
          }
        ],
        "icmpType": "string",
      }
    ],
    "outbound": [
      {
        "name": "string" /*required*/,
        "id": "string",
        "description": "string",
        "protocolType": "string" /*required*/,
        "port": "string" /*required*/,
        "openForAll": "boolean" /*required*/,
        "scope": [
          {
            "type": "string",
            "data": {
              "cidr": "string",
              "note": "string",
            }
          }
        ],
        "icmpType": "string",
      }
    ]
  }
  "tags": {}
}
```

####Request Parameters

* securityGroupName (string, optional): The name of the Security Group.
* description (string, optional): The description of the Security Group.
* vpcId (string, optional): The VPC of the Security Group.
* regionId (string, optional): Can be one of the next regions - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
* cloudAccountId (string, optional): Dome9 Cloud Account ID.
* services (object, optional): an option to add services to the security group.
 * name (string): The service name.
 * id (string) : The service id.
 * description (string, optional): The service description.
 * protocolType (string): Can be one of the following protocols - 'HOPOPT', 'ICMP', 'IGMP', 'GGP', 'IPV4', 'ST', 'TCP', 'CBT', 'EGP', 'IGP', 'BBN_RCC_MON', 'NVP2', 'PUP', 'ARGUS', 'EMCON', 'XNET', 'CHAOS', 'UDP', 'MUX', 'DCN_MEAS', 'HMP', 'PRM', 'XNS_IDP', 'TRUNK1', 'TRUNK2', 'LEAF1', 'LEAF2', 'RDP', 'IRTP', 'ISO_TP4', 'NETBLT', 'MFE_NSP', 'MERIT_INP', 'DCCP', 'ThreePC', 'IDPR', 'XTP', 'DDP', 'IDPR_CMTP', 'TPplusplus', 'IL', 'IPV6', 'SDRP', 'IPV6_ROUTE', 'IPV6_FRAG', 'IDRP', 'RSVP', 'GRE', 'DSR', 'BNA', 'ESP', 'AH', 'I_NLSP', 'SWIPE', 'NARP', 'MOBILE', 'TLSP', 'SKIP', 'IPV6_ICMP', 'IPV6_NONXT', 'IPV6_OPTS', 'CFTP', 'SAT_EXPAK', 'KRYPTOLAN', 'RVD', 'IPPC', 'SAT_MON', 'VISA', 'IPCV', 'CPNX', 'CPHB', 'WSN', 'PVP', 'BR_SAT_MON', 'SUN_ND', 'WB_MON', 'WB_EXPAK', 'ISO_IP', 'VMTP', 'SECURE_VMTP', 'VINES', 'TTP', 'NSFNET_IGP', 'DGP', 'TCF', 'EIGRP', 'OSPFIGP', 'SPRITE_RPC', 'LARP', 'MTP', 'AX25', 'IPIP', 'MICP', 'SCC_SP', 'ETHERIP', 'ENCAP', 'GMTP', 'IFMP', 'PNNI', 'PIM', 'ARIS', 'SCPS', 'QNX', 'AN', 'IPCOMP', 'SNP', 'COMPAQ_PEER', 'IPX_IN_IP', 'VRRP', 'PGM', 'L2TP', 'DDX', 'IATP', 'STP', 'SRP', 'UTI', 'SMP', 'SM', 'PTP', 'ISIS', 'FIRE', 'CRTP', 'CRUDP', 'SSCOPMCE', 'IPLT', 'SPS', 'PIPE', 'SCTP', 'FC', 'RSVP_E2E_IGNORE', 'MOBILITY_HEADER', 'UDPLITE', 'MPLS_IN_IP', 'MANET', 'HIP', 'SHIM6', 'WESP', 'ROHC', 'ALL'.
 * port (string, optional): The port (can be a port range).
 * openForAll (boolean): if it is "true" the service will be open for the entire Internet, and if "false" the service will be open to the given scopes.
 * scope (Array[ScopeElementViewModel], optional): The service's scope. If the service is "closed" then the scope isn't necessary.
   * type (string): Can be one of the following - ['CIDR', 'DNS', 'IPList', 'MagicIP', 'AWS'],
   * data (object): For CIDR - "cidr":'IP', For IP-List - "id":"IP-LIST ID","name":"IP-LIST NAME"}, For SG reference - {"extid": "AWS SG ID", "name": "SG NAME"}, for Magic IP - {"type": "MagicIP","data": {"name": "Magic IP Name"}, for DNS - {"type": "DNS","data": {"dns": "DNS ADDRESS","note": 'optional comment'}}
 * inbound (boolean): If "true", the service will be added to the group's inbound rules and if "false", the service will be added to the group's outbound rules.
 * icmpType (string, optional): In case of ICMP - 'EchoReply', 'DestinationUnreachable', 'SourceQuench', 'Redirect', 'AlternateHostAddress', 'Echo', 'RouterAdvertisement', 'RouterSelection', 'TimeExceeded', 'ParameterProblem', 'Timestamp', 'TimestampReply', 'InformationRequest', 'InformationReply', 'AddressMaskRequest', 'AddressMaskReply', 'Traceroute', 'DatagramConversionError', 'MobileHostRedirect', 'IPv6WhereAreYou', 'IPv6IAmHere', 'MobileRegistrationRequest', 'MobileRegistrationReply', 'DomainNameRequest', 'DomainNameReply', 'SKIP', 'Photuris', 'All'
* tags (object, optional)

**Example:**
```bash
curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{


  "isProtected": true,
  "securityGroupName": "string",
  "description": "string",
  "vpcId": "vpc-*******",
  "regionId": "us_east_1",
  "cloudAccountId": "*******-****-****-****-***********",
  "tags": {}
}' 'https://api.dome9.com/v2/CloudSecurityGroup'
```

####Response 


* securityGroupId (integer): The Security Group ID in Dome9.
* externalId (string): The Security Group ID in AWS.
* isProtected (boolean, optional): will appear as "true" if the group is in "Full Protection" mode, or will appear as "false" if the group is in "Read Only" mode.
* securityGroupName (string, optional): The name of the Security Group.
* description (string, optional): The description of the Security Group.
* vpcId (string, optional): The VPC id of the Security Group.
* regionId (string, optional): Can be one of the following regions - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
* cloudAccountId (string, optional): Dome9 Cloud Account ID.
* services (object, optional) - The group's inbound and outbound services.
* tags (object, optional) - The security group's tags.

<h3><a name="aws-security-groups-create-service">Create Service</a></h3>

Create a new service for an AWS security group.

URL: /cloudsecuritygroup/{groupid}/services/{policyType} <br \>
METHOD: POST <br \>
policyType: if set as "Inbound" the service will be created in the group's inbound services and if set as "Outbound" it will be created in the group's outbound services.
groupid: The groupid in the URL can be either the internal id or the external id. <br \>

BODY:
```json
{
  "name": "string" /*required*/,
  "id": "string",
  "description": "string",
  "protocolType": "string" /*required*/,
  "port": "string" /*required*/,
  "openForAll": "boolean" /*required*/,
  "scope": [
    {
      "type": "string",
      "data": "object"
    }
  ],
  "icmpType": "string"
}
```

####Request Parameters 

* name (string): The service name.
* id (string): The service id.
* description (string, optional): The service description.
* protocolType (string): Can be one of the following protocols - 'HOPOPT', 'ICMP', 'IGMP', 'GGP', 'IPV4', 'ST', 'TCP', 'CBT', 'EGP', 'IGP', 'BBN_RCC_MON', 'NVP2', 'PUP', 'ARGUS', 'EMCON', 'XNET', 'CHAOS', 'UDP', 'MUX', 'DCN_MEAS', 'HMP', 'PRM', 'XNS_IDP', 'TRUNK1', 'TRUNK2', 'LEAF1', 'LEAF2', 'RDP', 'IRTP', 'ISO_TP4', 'NETBLT', 'MFE_NSP', 'MERIT_INP', 'DCCP', 'ThreePC', 'IDPR', 'XTP', 'DDP', 'IDPR_CMTP', 'TPplusplus', 'IL', 'IPV6', 'SDRP', 'IPV6_ROUTE', 'IPV6_FRAG', 'IDRP', 'RSVP', 'GRE', 'DSR', 'BNA', 'ESP', 'AH', 'I_NLSP', 'SWIPE', 'NARP', 'MOBILE', 'TLSP', 'SKIP', 'IPV6_ICMP', 'IPV6_NONXT', 'IPV6_OPTS', 'CFTP', 'SAT_EXPAK', 'KRYPTOLAN', 'RVD', 'IPPC', 'SAT_MON', 'VISA', 'IPCV', 'CPNX', 'CPHB', 'WSN', 'PVP', 'BR_SAT_MON', 'SUN_ND', 'WB_MON', 'WB_EXPAK', 'ISO_IP', 'VMTP', 'SECURE_VMTP', 'VINES', 'TTP', 'NSFNET_IGP', 'DGP', 'TCF', 'EIGRP', 'OSPFIGP', 'SPRITE_RPC', 'LARP', 'MTP', 'AX25', 'IPIP', 'MICP', 'SCC_SP', 'ETHERIP', 'ENCAP', 'GMTP', 'IFMP', 'PNNI', 'PIM', 'ARIS', 'SCPS', 'QNX', 'AN', 'IPCOMP', 'SNP', 'COMPAQ_PEER', 'IPX_IN_IP', 'VRRP', 'PGM', 'L2TP', 'DDX', 'IATP', 'STP', 'SRP', 'UTI', 'SMP', 'SM', 'PTP', 'ISIS', 'FIRE', 'CRTP', 'CRUDP', 'SSCOPMCE', 'IPLT', 'SPS', 'PIPE', 'SCTP', 'FC', 'RSVP_E2E_IGNORE', 'MOBILITY_HEADER', 'UDPLITE', 'MPLS_IN_IP', 'MANET', 'HIP', 'SHIM6', 'WESP', 'ROHC', 'ALL'.
* port (string, optional): The port (can be a port range).
* openForAll (boolean): if "true", the service will be open for the entire internet, otherwise it will be open according to the given scope parameter. 
* scope (Array[ScopeElementViewModel], optional): The service scope. If the service is "closed" then the scope isn't necessary.
  * type (string): Can be one of the following - ['CIDR', 'DNS', 'IPList', 'MagicIP', 'AWS'],
  * data (object): For CIDR - "cidr":'IP', For IP-List - "id":"IP-LIST ID","name":"IP-LIST NAME"}, For SG reference - {"extid": "AWS SG ID", "name": "SG NAME"}, for Magic IP - {"type": "MagicIP","data": {"name": "Magic IP Name"}, for DNS - {"type": "DNS","data": {"dns": "DNS ADDRESS","note": 'optional comment'}}
* icmpType (string, optional): In case of ICMP - 'EchoReply', 'DestinationUnreachable', 'SourceQuench', 'Redirect', 'AlternateHostAddress', 'Echo', 'RouterAdvertisement', 'RouterSelection', 'TimeExceeded', 'ParameterProblem', 'Timestamp', 'TimestampReply', 'InformationRequest', 'InformationReply', 'AddressMaskRequest', 'AddressMaskReply', 'Traceroute', 'DatagramConversionError', 'MobileHostRedirect', 'IPv6WhereAreYou', 'IPv6IAmHere', 'MobileRegistrationRequest', 'MobileRegistrationReply', 'DomainNameRequest', 'DomainNameReply', 'SKIP', 'Photuris', 'All'

**Example**:
```bash
curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
"id":"6-22",
"name":"SSH",
"description":"Secure Shell access",
"protocolType":"TCP",
"port":"22",
"openForAll":false,
"scope":[
{
"type":"CIDR",
"data":{
"cidr":"10.0.0.1/32",
"note":null
}
}
],
"inbound":true,
"icmpType":null
}' 'https://api.dome9.com/v2/cloudsecuritygroup/543921/services/Inbound'
```
####Response

Similar to the request parameters.

<h3><a name="aws-security-groups-overwrite-security-group">Overwrite Security Group</a></h3> 

Overwrite an existing Security Group, overwrite tags and services.

URL: /CloudSecurityGroup/{groupid} <br \>
METHOD: PUT <br \>
groupid: the security group id, can be both of AWS and Dome9. <br \>
BODY:
```json
{
  "description": "string",
  "services": {
    "inbound": [
      {
        "name": "string" /*required*/,
        "id": "string",
        "description": null,
        "protocolType": "string" /*required*/,
        "port": "string" /*required*/,
        "openForAll": "boolean" /*required*/,
        "scope": [
          {
            "type": "string",
            "data": {
              "cidr": "string",
              "note": null
            }
          }
        ],
        "icmpType": "string",
      }
    ],
    "outbound": [
      {
        "name": "string" /*required*/,
        "id": "string",
        "description": "string",
        "protocolType": "string" /*required*/,
        "port": "string" /*required*/,
        "openForAll": "boolean" /*required*/,
        "scope": [
          {
            "type": "string",
            "data": {
              "cidr": "string",
              "note": "string",
            }
          }
        ],
        "icmpType": "string",
      }
    ]
  }
  "tags": {}
}
```

####Request Parameters

* name (string): The service name.
* id (string): The service id.
* description (string, optional): The service description.
* protocolType (string): Can be one of the following protocols - 'HOPOPT', 'ICMP', 'IGMP', 'GGP', 'IPV4', 'ST', 'TCP', 'CBT', 'EGP', 'IGP', 'BBN_RCC_MON', 'NVP2', 'PUP', 'ARGUS', 'EMCON', 'XNET', 'CHAOS', 'UDP', 'MUX', 'DCN_MEAS', 'HMP', 'PRM', 'XNS_IDP', 'TRUNK1', 'TRUNK2', 'LEAF1', 'LEAF2', 'RDP', 'IRTP', 'ISO_TP4', 'NETBLT', 'MFE_NSP', 'MERIT_INP', 'DCCP', 'ThreePC', 'IDPR', 'XTP', 'DDP', 'IDPR_CMTP', 'TPplusplus', 'IL', 'IPV6', 'SDRP', 'IPV6_ROUTE', 'IPV6_FRAG', 'IDRP', 'RSVP', 'GRE', 'DSR', 'BNA', 'ESP', 'AH', 'I_NLSP', 'SWIPE', 'NARP', 'MOBILE', 'TLSP', 'SKIP', 'IPV6_ICMP', 'IPV6_NONXT', 'IPV6_OPTS', 'CFTP', 'SAT_EXPAK', 'KRYPTOLAN', 'RVD', 'IPPC', 'SAT_MON', 'VISA', 'IPCV', 'CPNX', 'CPHB', 'WSN', 'PVP', 'BR_SAT_MON', 'SUN_ND', 'WB_MON', 'WB_EXPAK', 'ISO_IP', 'VMTP', 'SECURE_VMTP', 'VINES', 'TTP', 'NSFNET_IGP', 'DGP', 'TCF', 'EIGRP', 'OSPFIGP', 'SPRITE_RPC', 'LARP', 'MTP', 'AX25', 'IPIP', 'MICP', 'SCC_SP', 'ETHERIP', 'ENCAP', 'GMTP', 'IFMP', 'PNNI', 'PIM', 'ARIS', 'SCPS', 'QNX', 'AN', 'IPCOMP', 'SNP', 'COMPAQ_PEER', 'IPX_IN_IP', 'VRRP', 'PGM', 'L2TP', 'DDX', 'IATP', 'STP', 'SRP', 'UTI', 'SMP', 'SM', 'PTP', 'ISIS', 'FIRE', 'CRTP', 'CRUDP', 'SSCOPMCE', 'IPLT', 'SPS', 'PIPE', 'SCTP', 'FC', 'RSVP_E2E_IGNORE', 'MOBILITY_HEADER', 'UDPLITE', 'MPLS_IN_IP', 'MANET', 'HIP', 'SHIM6', 'WESP', 'ROHC', 'ALL'.
* port (string, optional): The port (can be port range).
* openForAll (boolean): if  "true" the service will be open to the entire internet, and if set to "false" the service will be open  according to the given scope parameter.
* scope (Array[ScopeElementViewModel], optional): The service scope. If the service is "closed" then the scope isn't necessary.
  * type (string): can be one of the following - ['CIDR', 'DNS', 'IPList', 'MagicIP', 'AWS'],
  * data (object): for CIDR - "cidr":'IP', For IP-List - "id":"IP-LIST ID","name":"IP-LIST NAME"}, For SG reference - {"extid": "AWS SG ID", "name": "SG NAME"}, for Magic IP - {"type": "MagicIP","data": {"name": "Magic IP Name"}, for DNS - {"type": "DNS","data": {"dns": "DNS ADDRESS","note": 'optional comment'}}
* icmpType (string, optional): in case of ICMP - 'EchoReply', 'DestinationUnreachable', 'SourceQuench', 'Redirect', 'AlternateHostAddress', 'Echo', 'RouterAdvertisement', 'RouterSelection', 'TimeExceeded', 'ParameterProblem', 'Timestamp', 'TimestampReply', 'InformationRequest', 'InformationReply', 'AddressMaskRequest', 'AddressMaskReply', 'Traceroute', 'DatagramConversionError', 'MobileHostRedirect', 'IPv6WhereAreYou', 'IPv6IAmHere', 'MobileRegistrationRequest', 'MobileRegistrationReply', 'DomainNameRequest', 'DomainNameReply', 'SKIP', 'Photuris', 'All'
* tags (object): the format is "key":"value".

**Example:**
```bash
curl -u id:secret -X PUT --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "securityGroupId": ******,
  "externalId": "sg-******",
  "isProtected": true,
  "securityGroupName": "string",
  "description": "string",
  "vpcId": "vpc-*******",
  "vpcName": "testt",
  "regionId": "us_east_1",
  "cloudAccountId": "*****************************",
  "cloudAccountName": "Staging Automation",
  "services": {
    "inbound": [
      {
        "id": "6-22",
        "name": "SSH",
        "description": "Secure Shell access",
        "protocolType": "TCP",
        "port": "22",
        "openForAll": false,
        "scope": [
          {
            "type": "CIDR",
            "data": {
              "cidr": "10.0.0.1/32",
              "note": null
            }
          }
        ],
        "inbound": true,
        "icmpType": null
      }
    ],
    "outbound": [
      {
        "id": "-1",
        "name": "All Traffic",
        "description": "Allow all outbound traffic",
        "protocolType": "ALL",
        "port": "",
        "openForAll": true,
        "scope": [
          {
            "type": "CIDR",
            "data": {
              "cidr": "0.0.0.0/0",
              "note": "Allow All Traffic"
            }
          }
        ],
        "inbound": false,
        "icmpType": null
      }
    ]
  },
  "tags": {}
}' 'https://api.dome9.com/v2/cloudsecuritygroup/543921'
```

####Response

Similar to the request parameters.


<h3><a name="aws-security-groups-overwrite-service">Overwrite Service</a></h3>

Update an existing security group's service.
note: the service will be fully overwritten.

URL: /cloudsecuritygroup/{groupid}/services/{policyType} <br \>
METHOD: PUT <br \>
policyType: if set as "Inbound" it will overwrite the service in the group's inbound policy, and if set as "Outbound" it will overwrite the service in the group's outbound policy.
groupid: The groupid in the URL can be either the group's Dome9 internal id or the group's AWS external id. <br \>

BODY:
```json
{
  "name": "string" /*required*/,
  "id": "string",
  "description": "string",
  "protocolType": "string" /*required*/,
  "port": "string" /*required*/,
  "openForAll": "boolean" /*required*/,
  "scope": [
    {
      "type": "string",
      "data": "object"
    }
  ],
  "icmpType": "string"
}
```

####Request Parameters

* name (string): The service name.
* id (string): The service id.
* description (string, optional): The service description.
* protocolType (string): Can be one of the following protocols - 'HOPOPT', 'ICMP', 'IGMP', 'GGP', 'IPV4', 'ST', 'TCP', 'CBT', 'EGP', 'IGP', 'BBN_RCC_MON', 'NVP2', 'PUP', 'ARGUS', 'EMCON', 'XNET', 'CHAOS', 'UDP', 'MUX', 'DCN_MEAS', 'HMP', 'PRM', 'XNS_IDP', 'TRUNK1', 'TRUNK2', 'LEAF1', 'LEAF2', 'RDP', 'IRTP', 'ISO_TP4', 'NETBLT', 'MFE_NSP', 'MERIT_INP', 'DCCP', 'ThreePC', 'IDPR', 'XTP', 'DDP', 'IDPR_CMTP', 'TPplusplus', 'IL', 'IPV6', 'SDRP', 'IPV6_ROUTE', 'IPV6_FRAG', 'IDRP', 'RSVP', 'GRE', 'DSR', 'BNA', 'ESP', 'AH', 'I_NLSP', 'SWIPE', 'NARP', 'MOBILE', 'TLSP', 'SKIP', 'IPV6_ICMP', 'IPV6_NONXT', 'IPV6_OPTS', 'CFTP', 'SAT_EXPAK', 'KRYPTOLAN', 'RVD', 'IPPC', 'SAT_MON', 'VISA', 'IPCV', 'CPNX', 'CPHB', 'WSN', 'PVP', 'BR_SAT_MON', 'SUN_ND', 'WB_MON', 'WB_EXPAK', 'ISO_IP', 'VMTP', 'SECURE_VMTP', 'VINES', 'TTP', 'NSFNET_IGP', 'DGP', 'TCF', 'EIGRP', 'OSPFIGP', 'SPRITE_RPC', 'LARP', 'MTP', 'AX25', 'IPIP', 'MICP', 'SCC_SP', 'ETHERIP', 'ENCAP', 'GMTP', 'IFMP', 'PNNI', 'PIM', 'ARIS', 'SCPS', 'QNX', 'AN', 'IPCOMP', 'SNP', 'COMPAQ_PEER', 'IPX_IN_IP', 'VRRP', 'PGM', 'L2TP', 'DDX', 'IATP', 'STP', 'SRP', 'UTI', 'SMP', 'SM', 'PTP', 'ISIS', 'FIRE', 'CRTP', 'CRUDP', 'SSCOPMCE', 'IPLT', 'SPS', 'PIPE', 'SCTP', 'FC', 'RSVP_E2E_IGNORE', 'MOBILITY_HEADER', 'UDPLITE', 'MPLS_IN_IP', 'MANET', 'HIP', 'SHIM6', 'WESP', 'ROHC', 'ALL'.
* port (string, optional): The port (can be a  port range).
* openForAll (boolean): if set as "true" the service will be open to the entire internet, and if set as "false" the service will be open according to the given scope parameter.
* scope (Array[ScopeElementViewModel], optional): The service scope. If the service is "closed" then the scope isn't necessary.
  * type (string): can be one of the following - ['CIDR', 'DNS', 'IPList', 'MagicIP', 'AWS'],
  * data (object): for CIDR - "cidr":'IP', For IP-List - "id":"IP-LIST ID","name":"IP-LIST NAME"}, For SG reference - {"extid": "AWS SG ID", "name": "SG NAME"}, for Magic IP - {"type": "MagicIP","data": {"name": "Magic IP Name"}, for DNS - {"type": "DNS","data": {"dns": "DNS ADDRESS","note": 'optional comment'}}
* icmpType (string, optional): in case of ICMP - 'EchoReply', 'DestinationUnreachable', 'SourceQuench', 'Redirect', 'AlternateHostAddress', 'Echo', 'RouterAdvertisement', 'RouterSelection', 'TimeExceeded', 'ParameterProblem', 'Timestamp', 'TimestampReply', 'InformationRequest', 'InformationReply', 'AddressMaskRequest', 'AddressMaskReply', 'Traceroute', 'DatagramConversionError', 'MobileHostRedirect', 'IPv6WhereAreYou', 'IPv6IAmHere', 'MobileRegistrationRequest', 'MobileRegistrationReply', 'DomainNameRequest', 'DomainNameReply', 'SKIP', 'Photuris', 'All'

**Example:**
```bash

curl -u id:secret -X PUT --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
        "id": "6-22",
        "name": "SSH",
        "description": "Secure Shell access",
        "protocolType": "TCP",
        "port": "22",
        "openForAll": false,
        "scope": [
          {
            "type": "CIDR",
            "data": {
              "cidr": "10.0.0.2/32",
              "note": null
            }
          }
        ],
        "inbound": true,
        "icmpType": null
      }' 'https://api.dome9.com/v2/cloudsecuritygroup/******/services/Inbound'

```

####Response

Similar to the request parameters.

<h3><a name="aws-security-groups-delete-service">Delete Service</a></h3>

Delete an existing service from a security group's policy.

URL: /cloudsecuritygroup/{groupid}/services/{policyType}/{serviceid} <br \>
METHOD: DELETE <br \>
* serviceid: composed of the port and protocol type with the following structure "{port}-{protocol type}",for example in ssh case it will be "6-22".
* groupid: The groupid in the URL can be either the internal id or the external id.
policyType: if set as "Inbound" it will delete the service in the security group's inbound policy and if set as "Outbound" it will delete the service in the security group's outbound policy.

**Example:**
```bash
https://api.dome9.com/v2/cloudsecuritygroup/*****/services/Inbound/6-22
```

####Response

If successful the response is null.

<h3><a name="aws-security-groups-delete-security-groups">Delete Security Groups</a></h3>

Delete an existing security group.

URL: /cloudsecuritygroup/{groupid} <br \>
METHOD: DELETE <br \>

* groupid: The groupid in the URL can be either the security group's Dome9 internal Id or the AWS external Id. <br \>

**Example:**
```bash
curl -u id:secret -X DELETE 'https://api.dome9.com/v2/cloudsecuritygroup/******'

```

####Response

When successful the response is null.

##<a name="aws-accounts">AWS Accounts</a>

###Add AWS Account.

Adding a new AWS account to your Dome9 account.

URL: /CloudAccounts <br \>
METHOD: POST <br \>
BODY:
```json
{
  "name": "string",
  "credentials": {
    "arn": "string" /*required*/, 
    "secret": "string" /*required*/,
    "type": "RoleBased" /*required*/,
    "isReadOnly": "boolean"
  },
  "fullProtection": "boolean"
}
```

####Request Parameters

* name (string, optional): the account name in Dome9.
* credentials (object, required): AWS account credentials.
  * arn (string, required): the AWS role's ARN to be used by Dome9.
  * secret (string, required): the role's External ID.
  * type (string, required): 'RoleBased'.
  * isReadOnly (boolean, optional): the attached policy type.
* fullProtection (boolean, optional): if "true", all security groups will be imported in "Full Protection" mode, otherwise all groups will be imported in "Read Only" mode.

**Example:**
```bash
curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "name": "string",
  "credentials": {
    "arn": "arn:aws:iam::***********:role/dome9-connect-staging",
    "secret": "********" ,
    "type": "RoleBased" ,
    "isReadOnly": "false"
  },
  "fullProtection": "false"
}' 'https://api.dome9.com/v2/CloudAccounts'
```

###Update AWS Account

Updating an existing attached AWS account.

URL: /CloudAccounts/{id} <br \>
METHOD: PATCH <br \>
id: The Dome9 cloud account ID <br \>

BODY:
```json
{
  "name": "string",
  "credentials": {
    "arn": "string" , 
    "secret": "string" ,
    "type": "RoleBased" ,
    "isReadOnly": "boolean"
  },
  "fullProtection": "boolean",
  "netSec": {
      "regions": [
        {
          "region": "string",
          "hidden": "boolean",
          "newGroupBehavior": "boolean"
        }
      ]
    }
}
```

####Request Parameters

* name (string, optional): the account name on Dome9.
* credentials (object, required): AWS account credentials.
  * arn (string, required): the AWS role's ARN to be used by Dome9.
  * secret (string, required): the role's external ID.
  * type (string, required): 'RoleBased'.
  * isReadOnly (boolean, optional): the attached policy type.
* fullProtection (boolean, optional): if "true", all security groups will be imported in "Full Protection" mode, otherwise all groups will be imported in "Read Only" mode.
* regions: the region data. It is only possible to update one region configuration on a single request.
  * region (string, optional): can be one of the following options - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
  * hidden (boolean, optional): if set as "true" then the security groups in the region won't be displayed, and if set as "false" then the security groups in the region will be shown. 
  * newGroupBehavior (string, optional): can be one of the following: 'ReadOnly', 'FullManage', 'Reset'.

**Example:**
  ```bash

  curl -u id:secret -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
    "id": "******************************",
    "vendor": "aws",
    "name": "string",
    "externalAccountNumber": "**********",
    "error": null,
    "credentials": {
      "arn": "arn:aws:iam::88888888888888:role/dome9-connect",
      "secret": ***********,
      "type": "RoleBased",
      "isReadOnly": false
    },
    "netSec": {
      "regions": [
        {
          "region": "us_east_1",
          "name": "N. Virginia",
          "hidden": false,
          "newGroupBehavior": "ReadOnly"
        }
      ]
    },
    "fullProtection": false,
    "allowReadOnly": false
  }' 'https://api.dome9.com/v2/CloudAccounts/*****************************'
```
###Delete AWS Account -

Delete an existing AWS Account. (Disconnect it from the Dome9 system)

URL: /CloudAccounts/{cloudAccountId} <br \>
METHOD: DELETE <br \>

cloudAccountId: The Dome9 cloudAccountId. 

**Example:**
```bash
curl -u id:secret -X DELETE 'https://api.dome9.com/v2/CloudAccounts/**************************'
```

##<a name="ip-lists">IP Lists </a>

###GET

The get request fetches all IP Lists, which are configured in the Dome9 account.
ID: If the request is made without the IP List id then all IP Lists will be fetched.

URL: /IpList/{id} <br \>
METHOD: GET <br \>

####Response
```json
[
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "items": [
      {
        "ip": "string",
        "comment": "string"
      }
    ]
  }
]
```

* id (integer): the IP List's Id.
* name (string): the IP List's name.
* description (string): the IP List's description.
* items (Array[IPDescriptor]): an array of Ips.
  * ip (string): IP address.
  * comment (string): a comment on the IP address, if exists.

**Example:**
```bash
curl -u id:secret -X GET --header 'Accept: application/json' 'https://api.dome9.com/v2/IpList'
```


###Create IP List
Create a new IP List.

URL: /IpList <br \>
METHOD: POST <br \>
BODY:
```json
{
  "name": "string", /* required */
  "description": "string",
  "items": [
    {
      "ip": "string", /* required */
      "comment": "string"
    }
  ]
}
```

**Example:**
```bash
curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "name": "string",
  "description": "string",
  "items": [
    {
      "ip": "10.0.0.1/32",
      "comment": "string"
    }
  ]
}' 'https://api.dome9.com/v2/IpList'
```

####Request Parameters 

* name (string): the IP List's name.
* description (string): the IP List's description.
* items (Array[IPDescriptor]): an array of IPs.
  * ip (string): IP address.
  * comment (string): a comment on the IP address.


###Update IP List

Update an existing IP List.
The Update is relevant for the data and the description.
It will overwrite the existing IP List.

URL: /IpList/{id} <br \>
METHOD: PUT <br \>

BODY:
```json
{
  "name": "string",
  "description": "string",
  "items": [
    {
      "ip": "string",
      "comment": "string"
    }
  ]
}
```

####Request Parameters
* id (in the URL): the IP List's ID.
* name (string): the IP List's name.
* description (string): the IP List's description.
* items (Array[IPDescriptor]): an array of IPs.
  * ip (string): IP address.
  * comment (string): a comment on the IP address.

**Example:**
 ```bash
 curl -u id:secret -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "id":121
   "name": "string",
   "description": "string",
   "items": [
     {
       "ip": "10.0.0.1/32",
       "comment": "string"
     }
   ]
 }' 'https://api.dome9.com/v2/IpList'
 ```

###Delete IP List

Delete an existing IP List.

URL: /IpList/{id} <br \>
METHOD: DELETE <br \>

* id: The IP List's Id.

**Example:**
```bash
curl -u id:secret -X DELETE 'https://api.dome9.com/v2/IpList/2841'
```

##<a name="dome9-agents">Dome9 Agents</a>

1. [Delete Dome9 agent](#dome9-agent-delete)

<h3><a name=“dome9-agent-delete”>DELETE</a></h3>

Delete an existing Dome9 Agent.

URL: /api/Agent/{id} <br \>
METHOD: DELETE <br \>

* id: The id in the URL is the Dome9 internal Id of the agent (server) in question. <br \>

**Example:**
```bash
curl -u id:secret -X DELETE 'https://api.dome9.com/v2/api/Agent/******'

```

####Response

When successful the response is null.

##<a name="users">Users</a>


<h3><a name="users-create">Create User</a></h3>

Create new user

URL: /user <br \>
METHOD: POST <br \>

BODY:
```json
{
  "email": "MyName@gmail.com",
  "firstName": "string",
  "lastName": "string",
  "ssoEnabled": true
}
```

####Request Parameters
* email(string, required):  The user email.
* firstName(string, required): First name
* lastName(string, required): Last name
* ssoEnabled(boolean, required): Will be true for SSO accounts only 

**Example:**
```bash

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "email": "MyName%%40gmail.com", \ 
   "firstName": "string", \ 
   "lastName": "string", \ 
   "ssoEnabled": true \ 
 }' 'https://api.dome9.com/v2/user'

```

####Response:

```json
{
  "id": 12041,
  "name": "arik+kk@gmail.com",
  "isSuspended": false,
  "isOwner": false,
  "isSuperUser": false,
  "hasApiKey": false,
  "isMfaEnabled": false,
  "ssoEnabled": true,
  "roleIds": [],
  "iamSafe": {
    "cloudAccounts": []
  },
  "permissions": {
    "access": [],
    "manage": [],
    "create": [],
    "view": [],
    "crossAccountAccess": []
  }
}
```

* id (integer): The Security Group ID in Dome9.
* externalId (string): The Security Group ID in AWS.
* isProtected (boolean, optional): will appear as "true" if the group is in "Full Protection" mode, or will appear as "false" if the group is in "Read Only" mode.
* securityGroupName (string, optional): The name of the Security Group.
* description (string, optional): The description of the Security Group.
* vpcId (string, optional): The VPC id of the Security Group.
* regionId (string, optional): Can be one of the following regions - 'us_east_1', 'us_west_1', 'eu_west_1', 'ap_southeast_1', 'ap_northeast_1', 'us_west_2', 'sa_east_1', 'az_1_region_a_geo_1', 'az_2_region_a_geo_1', 'az_3_region_a_geo_1', 'ap_southeast_2', 'mellanox_region', 'us_gov_west_1', 'eu_central_1', 'ap_northeast_2'
* cloudAccountId (string, optional): Dome9 Cloud Account ID.
* services (object, optional) - The security group's inbound and outbound services.
* tags (object, optional) - The security group's tags.

<h3><a name="users-delete">Delete User</a></h3>

Delete user

URL: /user/{id} <br \>
METHOD: DELETE <br \>
 
 * id: The user ID 

**Example:**
```bash

curl -X DELETE 'https://secure.dome9.com/api/user/12041'

```

####Response:

When successful the response is null.
