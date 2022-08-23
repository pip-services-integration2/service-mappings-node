import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';
import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsController } from './IMappingsController';
export declare class MappingsController implements IConfigurable, IReferenceable, ICommandable, IOpenable, IMappingsController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    private _logger;
    private _timer;
    private _interval;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    isOpen(): boolean;
    open(correlationId: string): Promise<void>;
    close(correlationId: string): Promise<void>;
    getCollectionNames(correlationId: string): Promise<string[]>;
    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<MappingV1>>;
    addMapping(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number): Promise<void>;
    mapToExternal(correlationId: string, collection: string, internalId: string): Promise<string>;
    mapToInternal(correlationId: string, collection: string, externalId: string): Promise<string>;
    deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string): Promise<void>;
    deleteExpiredMappings(correlationId: string): Promise<void>;
}