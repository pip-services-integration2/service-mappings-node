"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class MappingsCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/mappings');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-mappings', 'controller', 'default', '*', '1.0'));
    }
}
exports.MappingsCommandableHttpServiceV1 = MappingsCommandableHttpServiceV1;
//# sourceMappingURL=MappingsCommandableHttpServiceV1.js.map