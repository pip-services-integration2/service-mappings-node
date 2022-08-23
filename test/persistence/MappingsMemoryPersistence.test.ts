import { ConfigParams } from 'pip-services3-commons-nodex';

import { MappingsMemoryPersistence } from '../../src/persistence/MappingsMemoryPersistence';
import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

suite('MappingsMemoryPersistence', ()=> {
    let persistence: MappingsMemoryPersistence;
    let fixture: MappingsPersistenceFixture;
    
    setup(async () => {
        persistence = new MappingsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new MappingsPersistenceFixture(persistence);
        
        await persistence.open(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('Mapping collections', async () => {
        await fixture.testGetMappingCollections();
    });

    test('Get Mappings', async () => {
        await fixture.testGetMappings();
    });

    test('Mappings', async () => {
        await fixture.testMapping();
    });

    test('Expired Mappings', async () => {
        await fixture.testExpiredMappings();
    });
});