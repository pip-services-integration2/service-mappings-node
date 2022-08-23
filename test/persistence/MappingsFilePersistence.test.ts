import { MappingsFilePersistence } from '../../src/persistence/MappingsFilePersistence';
import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

suite('MappingsFilePersistence', () => {
    let persistence: MappingsFilePersistence;
    let fixture: MappingsPersistenceFixture;

    setup(async () => {
        persistence = new MappingsFilePersistence('./data/mappings.test.json');

        fixture = new MappingsPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
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