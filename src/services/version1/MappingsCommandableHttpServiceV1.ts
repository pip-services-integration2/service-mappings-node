import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class MappingsCommandableHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/mappings');
        this._dependencyResolver.put('controller', new Descriptor('service-mappings', 'controller', 'default', '*', '1.0'));
    }
}