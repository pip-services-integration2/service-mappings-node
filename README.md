# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Mappings microservice

This is Mappings microservice from Pip.Services library. 
It stores Mappings between internally and external service

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST
* Persistence: Flat Files, MongoDB

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-integration2/client-mappings-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
 

# Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class MappingV1 implements IStringIdentifiable {
    
    public id:string;
    public collection: string;
    public internal_id: string;
    public external_id: string;
    public expiration_time: Date;

}

interface IMappingsController {
    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void);
    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<MappingV1>>;
    addMapping(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number): Promise<void>;
    mapToExternal(correlationId: string, collection: string, internalId: string): Promise<string>;
    mapToInternal(correlationId: string, collection: string, externalId: string): Promise<string>;
    deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string): Promise<void>;
    deleteExpiredMappings(correlationId: string): Promise<void>;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-integration2/client-mappings-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "service-mappings"
  description: "Mappings microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-mappings:persistence:file:default:1.0"
  path: "./data/mappings.json"

- descriptor: "service-mappings:controller:default:default:1.0"

- descriptor: "service-mappings:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Install

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-mappings-node": "^1.0.*",
        ...
    }
}
```


## Use

Inside your code get the reference to the client SDK
```typescript
 import { MappingsHttpClientV1 } from 'client-mappings-node';
```

Define client configuration parameters.

```typescript
// Client configuration
let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);
client.configure(httpConfig);
```

Instantiate the client and open connection to the microservice
```typescript
// Create the client instance
client = new MappingsHttpClientV1();

// Connect to the microservice
await client.open(null);

// Work with the microservice
...
```
Now the client is ready to perform operations:

Add mapping:
```typescript 
let mapping = await client.addMapping("123", "Common.Collection", "123", "789", 60 * 1000);

console.dir('Mapping was created successfull');
```

Get mappings by filter:
```typescript    

let page = await client.getMappings("123", new FilterParams(), new PagingParams());

console.dir('Mappings was recived successfull');

for (let mapping in page.data) {
    console.dir('Mappings:');
    console.dir(mapping.toString());
}

let page = await client.getMappings(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false));

```

Delete mapping:
```typescript    
await client.deleteMappingById("123", "Common.Collection", "123", "789");
```

## Control functions

Get collection names:
```typescript
let collections = await client.getCollectionNames("123");

console.dir('Collections names:');
console.dir(collections);
```

Get external id by collection name and internal id:
```typescript
let id = await client.mapToExternal("123", "Common.Collection", "123");

console.dir('External id:', id);
```

Get internal id by collection name and external id:
```typescript
let id = await client.mapToInternal("123", "Common.Collection", "789"); 

console.dir('Internal id:', id);
```


## Acknowledgements

This microservice was created and currently maintained by 
- *Sergey Seroukhov*.
- *Levichev Dmitry*

