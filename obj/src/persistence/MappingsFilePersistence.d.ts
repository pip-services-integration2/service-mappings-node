import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';
import { MappingsMemoryPersistence } from './MappingsMemoryPersistence';
import { MappingV1 } from '../data/version1/MappingV1';
export declare class MappingsFilePersistence extends MappingsMemoryPersistence {
    protected _persister: JsonFilePersister<MappingV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
