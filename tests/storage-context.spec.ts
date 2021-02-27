import { StorageContext } from '../src';
import { MockStorageTransport } from './mock-storage-transport';

interface DummyEntity {
	test: boolean;
	value: string;
}

describe('StorageContext', () => {

	let transport: MockStorageTransport;
	let globalBaseContext: StorageContext<MockStorageTransport>;

	const createDefault = () => {
		transport = new MockStorageTransport();
		globalBaseContext = new StorageContext(transport);
		return globalBaseContext;
	};

	it('has an option to clear all keys', async () => {

		const baseContext = createDefault();
		const targetKVP = baseContext.getKeyValuePair('testEntry');
		await targetKVP.save('testValue');
		expect(targetKVP.value).toBe('testValue');

		await baseContext.clear();
		const reloadedValue = await targetKVP.load();
		expect(reloadedValue).not.toBeDefined();

		await targetKVP.clear();
		expect(targetKVP.value).toBe('');
	});

	describe('Key-Value Pair', () => {

		it('uses the underlying transport to make storage changes', async () => {

			spyOn(transport, 'setItem').and.callThrough();

			const baseContext = createDefault();
			const ctx = baseContext.getSubContext('testContext');
			expect(ctx.options.prefix).toBe('testContext');

			const kvp = ctx.getKeyValuePair('item');
			expect(kvp.absoluteKey).toBe([
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

			const baseContext = createDefault();
			const arrayContext = baseContext.getSubContext('tmpArray');
			const entityArray = arrayContext.createEntityArray<DummyEntity>();
			const existingValues = await entityArray.load();
			expect(existingValues).toEqual([]);

			const testValueArray: DummyEntity[] = [
				{ test: true, value: 'onety' },
				{ test: false, value: 'twoty' },
				{ test: true, value: 'threetee' },
			];

			await entityArray.save(testValueArray);
			const loadedValuesAfterSave = await entityArray.load();
			expect(loadedValuesAfterSave).toEqual(testValueArray);
		});

		it('can have a custom size attribute specified', () => {
			const baseContext = createDefault();
			const arrayContext = baseContext.getSubContext('tmpArray');
			const entityArray = arrayContext.createEntitySet<DummyEntity>().toSerializedArray('countKey');
			expect(entityArray.sizeEntity.entry.key).toBe('countKey');
		});
	});

	describe('Sub-Context', () => {

		it('has an isolated set of keys', async () => {

			const baseContext = createDefault();
			const subContext = baseContext.getSubContext('tmpContext');
			const kvp1 = subContext.getKeyValuePair('t1');
			const kvp2 = subContext.getKeyValuePair('t2');
			const kvp3 = baseContext.getKeyValuePair('t3');

			await kvp1.save('test');
			await kvp2.save('test');
			await kvp3.save('test');

			const expectedSubKeys = [kvp1.absoluteKey, kvp2.absoluteKey];
			const subKeys = await subContext.keys();
			expect(subKeys).toEqual(expectedSubKeys);

			await kvp3.clear();
			expect(subKeys).toEqual(expectedSubKeys);
		});
	});

	describe('General Usage', async () => {

		const baseContext = createDefault();
		const featureSetACtx = baseContext.getSubContext('featureSetA');
		const aIsInitializedEntity = featureSetACtx.getEntity<boolean>('isInitialized');
		const aIsInitialized = await aIsInitializedEntity.load(false);
		expect(aIsInitialized).toBe(false);

		await aIsInitializedEntity.save(true);
		const updatedInitValue = await aIsInitializedEntity.load();
		expect(updatedInitValue).toBe(true);
	});
});