import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { MappingV1 } from '../data/version1/MappingV1';
export interface IMappingsPersistence {
    getCollectionNames(correlationId: string): Promise<Array<string>>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<MappingV1>>;
    createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number): Promise<MappingV1>;
    getByInternalId(correlationId: string, collection: string, internalId: string): Promise<string>;
    getByExternalId(correlationId: string, collection: string, externalId: string): Promise<string>;
    delete(correlationId: string, collection: string, internalId: string, externalId: string): Promise<void>;
    deleteExpired(correlationId: string): Promise<void>;
}
