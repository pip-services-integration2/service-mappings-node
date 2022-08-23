import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';

import { CompositeLogger } from 'pip-services3-components-nodex';
import { FixedRateTimer } from 'pip-services3-commons-nodex';

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from '../persistence/IMappingsPersistence';
import { IMappingsController } from './IMappingsController';
import { MappingsCommandSet } from './MappingsCommandSet';

export class MappingsController implements IConfigurable, IReferenceable, ICommandable, IOpenable, IMappingsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-mappings:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(MappingsController._defaultConfig);
    private _persistence: IMappingsPersistence;
    private _commandSet: MappingsCommandSet;

    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _interval: number = 300000;

    public constructor() {}

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IMappingsPersistence>("persistence");
    }

    public getCommandSet(): CommandSet {
        return this._commandSet || (this._commandSet = new MappingsCommandSet(this));
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }

    public async open(correlationId: string): Promise<void> {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setCallback(() => {
            this._logger.info(correlationId, 'Cleaning expired mappings.');
            try {
                this.deleteExpiredMappings(correlationId);
            } catch(ex) {
                this._logger.error(correlationId, ex, 'Failed to clean expired mappings');
            }
        });
        this._timer.start();
    }

    public async close(correlationId: string): Promise<void> {
        this._timer.stop();
    }

    public async getCollectionNames(correlationId: string): Promise<string[]> {
        return await this._persistence.getCollectionNames(correlationId);
    }

    public async getMappings(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<MappingV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging);
    }

    public async addMapping(correlationId: string, collection: string,
        internalId: string, externalId: string, timeToLive: number): Promise<void> {
        await this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive);
    }

    public async mapToExternal(correlationId: string, collection: string, internalId: string): Promise<string> {
        return await this._persistence.getByInternalId(correlationId, collection, internalId);
    }

    public async mapToInternal(correlationId: string, collection: string, externalId: string): Promise<string> {
        return await this._persistence.getByExternalId(correlationId, collection, externalId);
    }

    public async deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string): Promise<void> {
        return await this._persistence.delete(correlationId, collection, internalId, externalId);
    }

    public async deleteExpiredMappings(correlationId: string): Promise<void> {
        return await this._persistence.deleteExpired(correlationId);
    }
}

