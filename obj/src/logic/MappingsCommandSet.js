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
exports.MappingsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
class MappingsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetCollectionNamesCommand());
        this.addCommand(this.makeGetMappingsCommand());
        this.addCommand(this.makeAddMappingCommand());
        this.addCommand(this.makeMapToInternalCommand());
        this.addCommand(this.makeMapToExternalCommand());
        this.addCommand(this.makeDeleteMappingCommand());
    }
    makeGetCollectionNamesCommand() {
        return new pip_services3_commons_nodex_2.Command("get_collection_names", new pip_services3_commons_nodex_5.ObjectSchema(true), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._logic.getCollectionNames(correlationId);
        }));
    }
    makeGetMappingsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_mappings", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            var filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            var paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.getMappings(correlationId, filter, paging);
        }));
    }
    makeAddMappingCommand() {
        return new pip_services3_commons_nodex_2.Command("add_mapping", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_nodex_6.TypeCode.String)
            .withOptionalProperty("ttl", pip_services3_commons_nodex_6.TypeCode.Long), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            var externalId = args.getAsString("external_id");
            var ttl = args.getAsNullableLong("ttl");
            return yield this._logic.addMapping(correlationId, collection, internalId, externalId, ttl);
        }));
    }
    makeMapToInternalCommand() {
        return new pip_services3_commons_nodex_2.Command("map_to_internal", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            var collection = args.getAsString("collection");
            var externalId = args.getAsString("external_id");
            return yield this._logic.mapToInternal(correlationId, collection, externalId);
        }));
    }
    makeMapToExternalCommand() {
        return new pip_services3_commons_nodex_2.Command("map_to_external", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            return yield this._logic.mapToExternal(correlationId, collection, internalId);
        }));
    }
    makeDeleteMappingCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_mapping", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            var externalId = args.getAsString("external_id");
            return yield this._logic.deleteMapping(correlationId, collection, internalId, externalId);
        }));
    }
}
exports.MappingsCommandSet = MappingsCommandSet;
//# sourceMappingURL=MappingsCommandSet.js.map