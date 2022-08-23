"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class MappingV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('collection', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('internal_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('external_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('expiration_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
    }
}
exports.MappingV1Schema = MappingV1Schema;
//# sourceMappingURL=MappingV1Schema.js.map