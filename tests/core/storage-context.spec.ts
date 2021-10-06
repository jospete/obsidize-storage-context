import { StorageContext } from '../../src';
import { MockStorageBaseContext } from '../mocks/mock-storage-base-context';

describe('StorageContext', () => {

	it('has an option to clear all keys', async () => {

		const baseContext = new MockStorageBaseContext();
		const targetKVP = baseContext.getKeyValuePair('testEntry');
		await targetKVP.save('testValue');
		const targetKVPValue = await targetKVP.load();
		expect(targetKVPValue).toBe('testValue');

		await baseContext.clear();
		const reloadedValue = await targetKVP.load();
		expect(reloadedValue).toBeFalsy();

		await targetKVP.clear();
		const targetKVPValue2 = await targetKVP.load('');
		expect(targetKVPValue2).toBe('');
	});

	describe('Key-Value Pair', () => {

		it('uses the underlying transport to make storage changes', async () => {

			const baseContext = new MockStorageBaseContext();
			const transport = baseContext.mockTransport;
			spyOn(transport, 'setItem').and.callThrough();

			const ctx = baseContext.getSubContext('testContext');
			expect(ctx.options.prefix).toBe('testContext');

			const kvp = ctx.getKeyValuePair('item');
			expect(kvp.absoluteKey).toBe([
				ctx.options.prefix,
				'item'
			].join(StorageContext.absolutePrefixSeparator));

			const currentValue = await kvp.load();
			expect(currentValue).toBeFalsy();

			await kvp.save('dummy_value');
			const updateValue = await kvp.load();
			expect(updateValue).toBe('dummy_value');

			const reloadedValue = await kvp.load();
			expect(reloadedValue).toBe(updateValue);
		});
	});

	describe('Entity', () => {

		it('returns the default value on load error', async () => {

			const baseContext = new MockStorageBaseContext();
			const testItem = baseContext.createEntity<number>('testItem');

			spyOn(baseContext.transport, 'getItem').and.callFake(() => Promise.reject('fake_error'));

			const result = await testItem.load(1234);
			expect(result).toBe(1234);
		});
	});

	describe('Entity Array', () => {

		interface DummyEntity {
			test: boolean;
			value: string;
		}

		it('stores the array as an entity set', async () => {

			const baseContext = new MockStorageBaseContext();
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
			const baseContext = new MockStorageBaseContext();
			const arrayContext = baseContext.getSubContext('tmpArray');
			const entityArray = arrayContext.createEntityMap<DummyEntity>().toSerializedArray('countKey');
			expect(entityArray.sizeEntity.keyValuePair.key).toBe('countKey');
		});
	});

	describe('Sub-Context', () => {

		it('has an isolated set of keys', async () => {

			const baseContext = new MockStorageBaseContext();
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

		it('can perform standard serializer operations', async () => {

			interface FeatureAEntity_1 {
				id: number;
				name: string;
				enabled: boolean;
			}

			const baseContext = new MockStorageBaseContext();
			const transport = baseContext.mockTransport;
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

			const entityMapValues = await aSerializedArray.entityMap.reloadAllValues();
			expect(entityMapValues).toEqual(sample_aArray);

			const dataDump: any = transport.mockStorage.toJSON();
			expect(dataDump).toEqual({
				featureSetA$isInitialized: 'true',
				featureSetA$serializedItems$length: '3',
				featureSetA$serializedItems$0: '{"id":0,"name":"test_0","enabled":true}',
				featureSetA$serializedItems$1: '{"id":1,"name":"test_1","enabled":false}',
				featureSetA$serializedItems$2: '{"id":2,"name":"test_2","enabled":true}'
			});

			expect(aSerializedArray.entityMap.entries().map(e => e.keyValuePair.absoluteKey)).toEqual([
				'featureSetA$serializedItems$0',
				'featureSetA$serializedItems$1',
				'featureSetA$serializedItems$2'
			]);

			await aSerializedArray.sizeEntity.clear();
			const aSerializedArray_AfterSizeClear = await aSerializedArray.load([]);
			expect(aSerializedArray_AfterSizeClear).toEqual([]);

			await aSerializedArray.clear();
			const updatedSizeValue = await aSerializedArray.sizeEntity.load();
			expect(updatedSizeValue).toBe(0);

			const aSerializedArray_LoadResult2 = await aSerializedArray.load();
			expect(aSerializedArray_LoadResult2).toEqual([]);
		});
	});
});