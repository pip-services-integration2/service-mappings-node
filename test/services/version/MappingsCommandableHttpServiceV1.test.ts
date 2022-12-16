const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { MappingV1 } from '../../../src/data/version1/MappingV1';
import { MappingsMemoryPersistence } from '../../../src/persistence/MappingsMemoryPersistence';
import { MappingsController } from '../../../src/logic/MappingsController';
import { MappingsCommandableHttpServiceV1 } from '../../../src/services/version1/MappingsCommandableHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);


suite('MappingsCommandableHttpServiceV1', () => {
    let service: MappingsCommandableHttpServiceV1;
    let rest: any;

    suiteSetup(async () => {
        let persistence = new MappingsMemoryPersistence();
        let controller = new MappingsController();

        service = new MappingsCommandableHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-mappings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-mappings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-mappings', 'service', 'commandable-http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });

    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });


    test('Test Mapping', async () => {
        let mapping1, mapping2: MappingV1;
        // Create one Mapping
        let mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection1",
                    internal_id: "123", 
                    external_id: "789", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.AnotherCollection1", 
                    internal_id: "123", 
                    external_id: "543", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection1", 
                    internal_id: "ABC", 
                    external_id: "XYZ", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        let collections = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/get_collection_names',
                {},
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isNotNull(collections);
        assert.equal(2, collections.length);
        assert.include(collections, "Common.Collection1");
        assert.include(collections, "Common.AnotherCollection1");

        // Add mappings
        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection2", 
                    internal_id: "123", 
                    external_id: "789", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.AnotherCollection2", 
                    internal_id: "123", 
                    external_id: "543", 
                    ttl: 60000 },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection2", 
                    internal_id: "ABC", 
                    external_id: "XYZ", 
                    ttl: 60000 },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection2", 
                    internal_id: "AAA", 
                    external_id: "111", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        let mappings = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/get_mappings',
                { 
                    filter: FilterParams.fromTuples("collection", "Common.Collection2"), 
                    paging: new PagingParams(1, 10, false) 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isNotNull(mappings);
        assert.isNotNull(mappings.data);
        assert.equal(2, mappings.data.length);

        // Add mappings
        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection", 
                    internal_id: "123", 
                    external_id: "789", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.AnotherCollection", 
                    internal_id: "123", 
                    external_id: "543", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        mapping = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/add_mapping',
                { 
                    collection: "Common.Collection", 
                    internal_id: "ABC", 
                    external_id: "XYZ", 
                    ttl: 60000 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(mapping);

        // Test internal mappings
        let id = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/map_to_external',
                { 
                    collection: "Common.Collection", 
                    internal_id: "123" 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.equal("789", id);

        // Test external mappings
        id = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/map_to_internal',
                { 
                    collection: "Common.Collection", 
                    external_id: "789"
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.equal("123", id);

        // Test different collection
        id = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/map_to_external',
                { 
                    collection: "Common.AnotherCollection", 
                    internal_id: "123" 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.equal("543", id);

        // Test non-exiting collection
        id = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/map_to_external',
                { 
                    collection: "Common.YetAnotherCollection", 
                    internal_id: "123" 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isEmpty(id);

        // Test non-exiting mapping
        id = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/mappings/map_to_external',
                { 
                    collection: "Common.Collection", 
                    internal_id: "555" 
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isEmpty(id);
    });
});


