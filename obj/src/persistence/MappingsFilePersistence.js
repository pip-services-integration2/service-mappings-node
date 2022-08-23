"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsFilePersistence = void 0;
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
const MappingsMemoryPersistence_1 = require("./MappingsMemoryPersistence");
class MappingsFilePersistence extends MappingsMemoryPersistence_1.MappingsMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_nodex_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.MappingsFilePersistence = MappingsFilePersistence;
//# sourceMappingURL=MappingsFilePersistence.js.map