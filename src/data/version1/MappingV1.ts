import { IStringIdentifiable } from 'pip-services3-commons-nodex';

export class MappingV1 implements IStringIdentifiable {
    public id: string;
    public collection: string;
    public internal_id: string;
    public external_id: string;
    public expiration_time: Date;
}