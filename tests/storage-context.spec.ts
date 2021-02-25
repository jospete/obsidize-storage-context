import { StorageContext } from '../src';
import { MockStorageTransport } from './mock-storage-transport';

describe('StorageContext', () => {

	let transport: MockStorageTransport;
	let baseContext: StorageContext<MockStorageTransport>;

	const createDefault = () => {
		transport = new MockStorageTransport();
		baseContext = new StorageContext(transport);
	};

	beforeEach(() => {
		createDefault();
	});

	describe('Key-Value Pair', () => {

		it('uses the underlying transport to make storage changes', async () => {

			spyOn(transport, 'setItem').and.callThrough();

			const ctx = baseContext.getSubContext('testContext');
			expect(ctx.options.prefix).toBe('testContext');

			const kvp = ctx.getKeyValuePair('item');
			expect(kvp.absoluteKey).toBe([
				baseContext.options.prefix,
				ctx.options.prefix,
				'item'
			].join(StorageContext.absolutePrefixSeparator));

			const currentValue = await kvp.load();
			expect(currentValue).not.toBeDefined();

			await kvp.save('dummy_value');
			const updateValue = kvp.value;
			expect(updateValue).toBe('dummy_value');

			const reloadedValue = await kvp.load();
			expect(reloadedValue).toBe(updateValue);
		});
	});

	describe('Entity Array', () => {

		it('stores the array as an entity set', async () => {

			interface DummyEntity {
				test: boolean;
				value: string;
			}

			const arrayContext = baseContext.getSubContext('tmpArray');
			const entityArray = arrayContext.createEntityArray<DummyEntity>();
			const existingValues = await entityArray.load();
			expect(existingValues).toEqual([]);
		});
	});
});