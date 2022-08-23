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
exports.MappingsController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const MappingsCommandSet_1 = require("./MappingsCommandSet");
class MappingsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(MappingsController._defaultConfig);
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._timer = new pip_services3_commons_nodex_3.FixedRateTimer();
        this._interval = 300000;
    }
    configure(config) {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired("persistence");
    }
    getCommandSet() {
        return this._commandSet || (this._commandSet = new MappingsCommandSet_1.MappingsCommandSet(this));
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.setDelay(this._interval);
            this._timer.setInterval(this._interval);
            this._timer.setCallback(() => {
                this._logger.info(correlationId, 'Cleaning expired mappings.');
                try {
                    this.deleteExpiredMappings(correlationId);
                }
                catch (ex) {
                    this._logger.error(correlationId, ex, 'Failed to clean expired mappings');
                }
            });
            this._timer.start();
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.stop();
        });
    }
    getCollectionNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getCollectionNames(correlationId);
        });
    }
    getMappings(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    addMapping(correlationId, collection, internalId, externalId, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive);
        });
    }
    mapToExternal(correlationId, collection, internalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getByInternalId(correlationId, collection, internalId);
        });
    }
    mapToInternal(correlationId, collection, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getByExternalId(correlationId, collection, externalId);
        });
    }
    deleteMapping(correlationId, collection, internalId, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.delete(correlationId, collection, internalId, externalId);
        });
    }
    deleteExpiredMappings(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.deleteExpired(correlationId);
        });
    }
}
exports.MappingsController = MappingsController;
MappingsController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-mappings:persistence:*:*:1.0');
//# sourceMappingURL=MappingsController.js.map