"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const MappingsServiceFactory_1 = require("../build/MappingsServiceFactory");
class MappingsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("mappings", "Mappings microservice");
        this._factories.add(new MappingsServiceFactory_1.MappingsServiceFactory);
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory);
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory);
    }
}
exports.MappingsProcess = MappingsProcess;
//# sourceMappingURL=MappingsProcess.js.map