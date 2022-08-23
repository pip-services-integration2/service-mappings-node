"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class MappingsHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/mappings');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-mappings', 'controller', 'default', '*', '1.0'));
    }
}
exports.MappingsHttpServiceV1 = MappingsHttpServiceV1;
//# sourceMappingURL=MappingsHttpServiceV1.js.map