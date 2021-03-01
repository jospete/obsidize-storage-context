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
		const targetKVPValue = await targetKVP.load();
		expect(targetKVPValue).toBe('testValue');

		await baseContext.clear();
		const reloadedValue = await targetKVP.load();
		expect(reloadedValue).not.toBeDefined();

		await targetKVP.clear();
		const targetKVPValue2 = await targetKVP.load('');
		expect(targetKVPValue2).toBe('');
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
			const updateValue = await kvp.load();
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

	describe('General Usage', () => {

		it('can run the readme example', async () => {

			interface FeatureAEntity_1 {
				id: number;
				name: string;
				enabled: boolean;
			}

			const baseContext = createDefault();
			const featureSetACtx = baseContext.getSubContext('featureSetA');
			const aIsInitializedEntity = featureSetACtx.createEntity<boolean>('isInitialized');
			const aIsInitialized = await aIsInitializedEntity.load(false);
			expect(aIsInitialized).toBe(false);

			await aIsInitializedEntity.save(true);
			const updatedInitValue = await aIsInitializedEntity.load();
			expect(updatedInitValue).toBe(true);

			const aSerializedArray = featureSetACtx.getSubContext('serializedItems').createEntityArray<FeatureAEntity_1>();
			const initialSerializedResult = await aSerializedArray.load();
			expect(initialSerializedResult).toEqual([]);

			const sample_aArray: FeatureAEntity_1[] = [
				{ id: 0, name: 'test_0', enabled: true },
				{ id: 1, name: 'test_1', enabled: false },
				{ id: 2, name: 'test_2', enabled: true },
			];

			await aSerializedArray.save(sample_aArray);
			const aSerializedArray_LoadResult = await aSerializedArray.load();
			expect(aSerializedArray_LoadResult).toEqual(sample_aArray);
			expect(transport.mockStorage.getItem(aSerializedArray.get(1).entry.absoluteKey)).toBe(JSON.stringify(sample_aArray[1]));
			expect(aSerializedArray.entitySet.keys()).toEqual([
				'featureSetA$serializedItems$length',
				'featureSetA$serializedItems$0',
				'featureSetA$serializedItems$1',
				'featureSetA$serializedItems$2'
			]);

			await aSerializedArray.clear();
			const updatedSizeValue = await aSerializedArray.sizeEntity.load();
			expect(updatedSizeValue).toBe(0);

			const aSerializedArray_LoadResult2 = await aSerializedArray.load();
			expect(aSerializedArray_LoadResult2).toEqual([]);
		});
	});
});