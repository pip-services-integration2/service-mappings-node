const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { IMappingsPersistence } from '../../src/persistence/IMappingsPersistence';

export class MappingsPersistenceFixture {
    private _persistence: IMappingsPersistence;

    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public async testGetMappingCollections() {
        // Add mappings

        // create one Mapping
        await this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);
        
        let items = await this._persistence.getCollectionNames(null);

        assert.equal(2, items.length);
        assert.include(items, "Common.Collection");
        assert.include(items, "Common.AnotherCollection");
    }

    public async testGetMappings() {

        // Add mappings
        await this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.Collection", "AAA", "111", 60 * 1000);

        let page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false));

        assert.isNotNull(page.data);
        assert.equal(2, page.data.length);
    }


    public async testMapping() {

        // Add mappings
        await this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000);
        await this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000);

        // Test internal mappings
        let id = await this._persistence.getByInternalId(null, "Common.Collection", "123");
        assert.equal("789", id);

        // Test external mappings
        id = await this._persistence.getByExternalId(null, "Common.Collection", "789");
        assert.equal("123", id);

        // Test different collection
        id = await this._persistence.getByInternalId(null, "Common.AnotherCollection", "123");
        assert.equal("543", id);
        
        // Test non-exiting collection
        id = await this._persistence.getByInternalId(null, "Common.YetAnotherCollection", "123");
        assert.isNull(id);

        // Test non-exiting mapping
        id = await this._persistence.getByInternalId(null, "Common.Collection", "555");
        assert.isNull(id);

        // Delete mapping
        this._persistence.delete(null, "Common.Collection", "123", "789");
        id = await this._persistence.getByInternalId(null, "Common.Collection", "123");
        assert.isNull(id);
    }

    public async testExpiredMappings() {
        // Add mappings
        await this._persistence.createFromParams(null, "Common.Collection", "123", "789", 100);
        await this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 100);

        // Wait to expire
        await new Promise(r => setTimeout(r, 500));
        await this._persistence.deleteExpired(null);

        // Try to read expired mappings
        let id = await this._persistence.getByInternalId(null, "Common.Collection", "123");
        assert.isNull(id);

        id = await this._persistence.getByInternalId(null, "Common.Collection", "ABC");
        assert.isNull(id);
    }

}
