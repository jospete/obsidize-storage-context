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

	describe('Key-Value Pairs', () => {

		it('uses the underlying transport to make storage changes', () => {

			spyOn(transport, 'setItem').and.callThrough();

			const ctx = baseContext.getSubContext('testContext');
			expect(ctx.options.prefix).toBe('testContext');

			const kvp = ctx.getKeyValuePair('item');
			expect(kvp.key).toBe(['testContext', 'item'].join(StorageContext.absolutePrefixSeparator));
		});
	});
});