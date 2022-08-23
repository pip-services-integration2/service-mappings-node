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
exports.MappingsMemoryPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
class MappingsMemoryPersistence extends pip_services3_data_nodex_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._defaultTTL = 7 * 24 * 60 * 60 * 1000;
    }
    getCollectionNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            for (let mapping of this._items) {
                let collection = mapping.collection;
                if (result.indexOf(collection) < 0)
                    result.push(collection);
            }
            return result;
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let collection = filter.getAsNullableString("collection");
        let id = filter.getAsNullableString("id");
        let internalId = filter.getAsNullableString("internal_id");
        let externalId = filter.getAsNullableString("external_id");
        let search = filter.getAsNullableString("search");
        return (item) => {
            if (collection != null && item.collection != collection)
                return false;
            if (id != null && item.external_id != id && item.internal_id != id)
                return false;
            if (internalId != null && item.internal_id != internalId)
                return false;
            if (externalId != null && item.external_id != externalId)
                return false;
            if (search != null && item.external_id != search && item.internal_id != search)
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    createFromParams(correlationId, collection, internalId, externalId, timeToLive) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let mapping;
            timeToLive = timeToLive > 0 ? timeToLive : this._defaultTTL;
            mapping = {
                collection: collection,
                internal_id: internalId,
                external_id: externalId,
                expiration_time: new Date(new Date().getTime() + timeToLive)
            };
            return yield _super.create.call(this, correlationId, mapping);
        });
    }
    getByInternalId(correlationId, collection, internalId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            let items = this._items.filter((m) => collection.localeCompare(m.collection) == 0 && internalId.localeCompare(m.internal_id) == 0);
            let mapping = items.length > 0 ? items[0] : null;
            result = mapping != null && mapping.expiration_time > new Date() ? mapping.external_id : null;
            return result;
        });
    }
    getByExternalId(correlationId, collection, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            let items = this._items.filter(m => collection.localeCompare(m.collection) == 0 && externalId.localeCompare(m.external_id) == 0);
            let mapping = items.length > 0 ? items[0] : null;
            result = mapping != null && mapping.expiration_time > new Date() ? mapping.internal_id : null;
            return result;
        });
    }
    delete(correlationId, collection, internalId, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = this._items.length - 1; index >= 0; index--) {
                let mapping = this._items[index];
                if (mapping.collection == collection
                    && mapping.internal_id == internalId
                    && mapping.external_id == externalId) {
                    this._items.splice(index, 1);
                    break;
                }
            }
        });
    }
    deleteExpired(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date().getTime();
            for (let index = this._items.length - 1; index >= 0; index--) {
                if (this._items[index].expiration_time.getTime() <= now) {
                    this._items.splice(index, 1);
                }
            }
        });
    }
}
exports.MappingsMemoryPersistence = MappingsMemoryPersistence;
//# sourceMappingURL=MappingsMemoryPersistence.js.map