import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { IMappingsController } from './IMappingsController';

export class MappingsCommandSet extends CommandSet {
    private _logic: IMappingsController;

    constructor(logic: IMappingsController) {
        super();

        this._logic = logic;

        // Register commands to the database
        this.addCommand(this.makeGetCollectionNamesCommand());
        this.addCommand(this.makeGetMappingsCommand());
        this.addCommand(this.makeAddMappingCommand());
        this.addCommand(this.makeMapToInternalCommand());
        this.addCommand(this.makeMapToExternalCommand());
        this.addCommand(this.makeDeleteMappingCommand());
    }

    private makeGetCollectionNamesCommand(): ICommand {
        return new Command(
            "get_collection_names",
            new ObjectSchema(true),
            async (correlationId: string, args: Parameters) => {
                return await this._logic.getCollectionNames(correlationId);
            });
    }

    private makeGetMappingsCommand(): ICommand {
        return new Command(
            "get_mappings",
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                var filter = FilterParams.fromValue(args.get("filter"));
                var paging = PagingParams.fromValue(args.get("paging"));
                return await this._logic.getMappings(correlationId, filter, paging);
            });
    }

    private makeAddMappingCommand(): ICommand {
        return new Command(
            "add_mapping",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String)
                .withOptionalProperty("ttl", TypeCode.Long), 
            async (correlationId: string, args: Parameters) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                var externalId = args.getAsString("external_id");
                var ttl = args.getAsNullableLong("ttl");
                return await this._logic.addMapping(correlationId, collection, internalId, externalId, ttl);

            });
    }

    private makeMapToInternalCommand(): ICommand {
        return new Command(
            "map_to_internal",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                var collection = args.getAsString("collection");
                var externalId = args.getAsString("external_id");
                return await this._logic.mapToInternal(correlationId, collection, externalId);
            });
    }

    private makeMapToExternalCommand(): ICommand {
        return new Command(
            "map_to_external",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                return await this._logic.mapToExternal(correlationId, collection, internalId);
            });
    }

    private makeDeleteMappingCommand(): ICommand {
        return new Command(
            "delete_mapping",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                var externalId = args.getAsString("external_id");
                return await this._logic.deleteMapping(correlationId, collection, internalId, externalId);
            });
    }

}