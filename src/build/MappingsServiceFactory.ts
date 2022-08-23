import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { MappingsMongoDbPersistence } from '../persistence/MappingsMongoDbPersistence';
import { MappingsFilePersistence } from '../persistence/MappingsFilePersistence';
import { MappingsMemoryPersistence } from '../persistence/MappingsMemoryPersistence';
import { MappingsController } from '../logic/MappingsController';
import { MappingsHttpServiceV1 } from '../services/version1/MappingsHttpServiceV1';

export class MappingsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-mappings", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-mappings", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-mappings", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-mappings", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-mappings", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-mappings", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(MappingsServiceFactory.MemoryPersistenceDescriptor, MappingsMemoryPersistence);
		this.registerAsType(MappingsServiceFactory.FilePersistenceDescriptor, MappingsFilePersistence);
		this.registerAsType(MappingsServiceFactory.MongoDbPersistenceDescriptor, MappingsMongoDbPersistence);
		this.registerAsType(MappingsServiceFactory.ControllerDescriptor, MappingsController);
		this.registerAsType(MappingsServiceFactory.HttpServiceDescriptor, MappingsHttpServiceV1);
	}
	
}
