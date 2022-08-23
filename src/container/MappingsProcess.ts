import { ProcessContainer } from 'pip-services3-container-nodex';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { MappingsServiceFactory } from '../build/MappingsServiceFactory';

export class MappingsProcess extends ProcessContainer {

    public constructor() {
        super("mappings", "Mappings microservice");
        this._factories.add(new MappingsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
        this._factories.add(new DefaultSwaggerFactory);
    }
}
