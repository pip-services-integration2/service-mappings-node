import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from './IMappingsPersistence';

export class MappingsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<MappingV1, string>
    implements IMappingsPersistence {

    private readonly _defaultTTL: number = 7 * 24 * 60 * 60 * 1000;

    constructor() {
        super('mappings');
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];
        let collection = filter.getAsNullableString("collection");
        let id = filter.getAsNullableString("id");
        let internalId = filter.getAsNullableString("internal_id");
        let externalId = filter.getAsNullableString("external_id");
        let search = filter.getAsNullableString("search");

        if (id != null) {
            let searchFilter = [];
            searchFilter.push({ external_id: id });
            searchFilter.push({ internal_id: id });
            criteria.push({ $or: searchFilter });
        }

        if (collection != null)
            criteria.push({ collection: collection });
        if (internalId != null)
            criteria.push({ internal_id: internalId });
        if (externalId != null)
            criteria.push({ external_id: externalId });
        if (search != null) {
            var searchFilter = [];
            searchFilter.push({ external_id: search });
            searchFilter.push({ internal_id: search });
            criteria.push({ $or: searchFilter });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    private makeId(collection: string, internalId: string, externalId: string): string {
        return collection + "_" + internalId + "_" + externalId;
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<MappingV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
    }

    public async createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, ttl: number): Promise<MappingV1> {

        ttl = ttl > 0 ? ttl : this._defaultTTL;

        let mapping = <MappingV1>{
            id: this.makeId(collection, internalId, externalId),
            collection: collection,
            internal_id: internalId,
            external_id: externalId,
            expiration_time: new Date(new Date().getTime() + ttl)
        };
        return await super.set(correlationId, mapping);
    }

    public async getCollectionNames(correlationId: string): Promise<string[]> {
        let results = await this._collection.aggregate([
            {
                "$group": { _id: "$collection", count: { $sum: 1 } }
            }
        ]).toArray();

        let items: string[] = [];
        
        for (let item of results)
            items.push(item._id);
        
        return items;
    }

    public async getByInternalId(correlationId: string, collection: string, internalId: string): Promise<string> {
        let filter = {
            collection: collection,
            internal_id: internalId
        };

        let items =  await super.getListByFilter(correlationId, filter, null, null);

        return items.length > 0 ? items[0].external_id : null;
    }

    public async getByExternalId(correlationId: string, collection: string, externalId: string): Promise<string> {
        let filter = {
            collection: collection,
            external_id: externalId
        };

        let items = await super.getListByFilter(correlationId, filter, null, null);

        return items.length > 0 ? items[0].internal_id : null;
    }

    public async delete(correlationId: string, collection: string, internalId: string, externalId: string): Promise<void> {
        let id = this.makeId(collection, internalId, externalId);
        await super.deleteById(correlationId, id);
    }

    public async deleteExpired(correlationId: string): Promise<void> {
        let now = new Date();
        let filter = { expiration_time: { $lte: now } };
        return await super.deleteByFilter(correlationId, filter);
    }
}
