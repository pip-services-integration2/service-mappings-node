"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class MappingsMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('mappings');
        this._defaultTTL = 7 * 24 * 60 * 60 * 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
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
    makeId(collection, internalId, externalId) {
        return collection + "_" + internalId + "_" + externalId;
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    createFromParams(correlationId, collection, internalId, externalId, ttl) {
        const _super = Object.create(null, {
            set: { get: () => super.set }
        });
        return __awaiter(this, void 0, void 0, function* () {
            ttl = ttl > 0 ? ttl : this._defaultTTL;
            let mapping = {
                id: this.makeId(collection, internalId, externalId),
                collection: collection,
                internal_id: internalId,
                external_id: externalId,
                expiration_time: new Date(new Date().getTime() + ttl)
            };
            return yield _super.set.call(this, correlationId, mapping);
        });
    }
    getCollectionNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this._collection.aggregate([
                {
                    "$group": { _id: "$collection", count: { $sum: 1 } }
                }
            ]).toArray();
            let items = [];
            for (let item of results)
                items.push(item._id);
            return items;
        });
    }
    getByInternalId(correlationId, collection, internalId) {
        const _super = Object.create(null, {
            getListByFilter: { get: () => super.getListByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {
                collection: collection,
                internal_id: internalId
            };
            let items = yield _super.getListByFilter.call(this, correlationId, filter, null, null);
            return items.length > 0 ? items[0].external_id : null;
        });
    }
    getByExternalId(correlationId, collection, externalId) {
        const _super = Object.create(null, {
            getListByFilter: { get: () => super.getListByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {
                collection: collection,
                external_id: externalId
            };
            let items = yield _super.getListByFilter.call(this, correlationId, filter, null, null);
            return items.length > 0 ? items[0].internal_id : null;
        });
    }
    delete(correlationId, collection, internalId, externalId) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let id = this.makeId(collection, internalId, externalId);
            yield _super.deleteById.call(this, correlationId, id);
        });
    }
    deleteExpired(correlationId) {
        const _super = Object.create(null, {
            deleteByFilter: { get: () => super.deleteByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let filter = { expiration_time: { $lte: now } };
            return yield _super.deleteByFilter.call(this, correlationId, filter);
        });
    }
}
exports.MappingsMongoDbPersistence = MappingsMongoDbPersistence;
//# sourceMappingURL=MappingsMongoDbPersistence.js.map