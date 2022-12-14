import { ConfigParams } from 'pip-services3-commons-nodex';

import { MappingsMongoDbPersistence } from '../../src/persistence/MappingsMongoDbPersistence';
import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

suite('MappingsMongoDbPersistence', () => {
    let persistence: MappingsMongoDbPersistence;
    let fixture: MappingsPersistenceFixture;

    setup(async () => {
        var MONGO_DB = process.env["MONGO_DB"] || "test";
        var MONGO_COLLECTION = process.env["MONGO_COLLECTION"] || "mappings";
        var MONGO_SERVICE_HOST = process.env["MONGO_SERVICE_HOST"] || "localhost";
        var MONGO_SERVICE_PORT = process.env["MONGO_SERVICE_PORT"] || "27017";
        var MONGO_SERVICE_URI = process.env["MONGO_SERVICE_URI"];

        var dbConfig = ConfigParams.fromTuples(
            "collection", MONGO_COLLECTION,
            "connection.database", MONGO_DB,
            "connection.host", MONGO_SERVICE_HOST,
            "connection.port", MONGO_SERVICE_PORT,
            "connection.uri", MONGO_SERVICE_URI
        );

        persistence = new MappingsMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new MappingsPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('Mapping collections', async () => {
        await fixture.testGetMappingCollections();
    });

    test('Get Mappings', async () => {
        await fixture.testGetMappings();
    });

    test('Mappings', async () => {
        await fixture.testMapping();
    });

    test('Expired Mappings', async () => {
        await fixture.testExpiredMappings();
    });

});