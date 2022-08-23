const assert = require('chai').assert;

import { ConfigParams } from "pip-services3-commons-nodex";
import { Descriptor } from "pip-services3-commons-nodex";
import { References } from "pip-services3-commons-nodex";
import { FilterParams } from "pip-services3-commons-nodex";
import { PagingParams } from "pip-services3-commons-nodex";

import { MappingsMemoryPersistence } from "../../src/persistence/MappingsMemoryPersistence";
import { MappingsController } from "../../src/logic/MappingsController";

suite('Mappings Controller', () => {
    let _persistence: MappingsMemoryPersistence;
    let _controller: MappingsController;

    setup(async () => {
        _persistence = new MappingsMemoryPersistence();
        _controller = new MappingsController();
        _persistence.configure(new ConfigParams());
        let references = References.fromTuples(
            new Descriptor("service-mappings", "persistence", "mock", "default", "1.0"), _persistence
        );
        _controller.setReferences(references);
        await _persistence.open(null);
    });

    teardown(async () => {
        await _persistence.close(null);
    });

    test('Test Get Mapping Collections', async () => {
        // Add mappings
        await _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000);
        await _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);

        let items = await _controller.getCollectionNames(null);

        assert.equal(2, items.length);
        assert.include(items, "Common.Collection");
        assert.include(items, "Common.AnotherCollection");
    });

    test('Test Get Mappings', async () => {
        // Add mappings
        await _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000);
        await _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);
        await _controller.addMapping(null, "Common.Collection", "AAA", "111", 60 * 1000);
        
        let mappings = await _controller.getMappings(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false));

        assert.isNotNull(mappings.data);
        assert.equal(2, mappings.data.length);
    });

    test('TestMapping', async () => {
        await _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000);
        await _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);
        
        // Test internal mappings
        let id = await _controller.mapToExternal(null, "Common.Collection", "123");
        assert.equal("789", id);

        // Test external mappings
        id = await _controller.mapToInternal(null, "Common.Collection", "789");
        assert.equal("123", id);

        // Test different collection
        id = await _controller.mapToExternal(null, "Common.AnotherCollection", "123");
        assert.equal("543", id);

        // Test non-exiting collection
        id = await _controller.mapToExternal(null, "Common.YetAnotherCollection", "123");
        assert.isNull(id);

        // Test non-exiting mapping
        id = await _controller.mapToExternal(null, "Common.Collection", "555");
        assert.isNull(id);
    });

    test('Test Expired Mappings', async () => {
        // Add mappings
        await _controller.addMapping(null, "Common.Collection", "123", "789", 100);
        await _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 100);

        // Wait to expire
        await new Promise(r => setTimeout(r, 500));

        await _controller.deleteExpiredMappings(null);

        // Try to read expired mappings
        let id = await _controller.mapToExternal(null, "Common.Collection", "123");
        assert.isNull(id);

        id = await _controller.mapToExternal(null, "Common.Collection", "ABC");
        assert.isNull(id);
    });

});