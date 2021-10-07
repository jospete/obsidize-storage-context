import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

import { BrowserStorageTransport, NativeStorageTransport, MockBrowserStorage, MockNativeStorage, ProxyStorageTransport, StorageContext } from '../src';

const createDefaults = () => {

	const mockBrowserTransport = new BrowserStorageTransport(new MockBrowserStorage());
	const mockNativeTransport = new NativeStorageTransport(new MockNativeStorage(new MockBrowserStorage()));

	const proxyTransport = new ProxyStorageTransport([
		mockBrowserTransport,
		mockNativeTransport
	]);

	const context = new StorageContext(proxyTransport);

	return {
		mockBrowserTransport,
		mockNativeTransport,
		proxyTransport,
		context
	};
};

describe('Example Native Storage Proxy', () => {

	it('works with direct references to real storage interfaces', async () => {

		const nativeStorage = new NativeStorage();

		// Create your transports
		const browserTransport = new BrowserStorageTransport(localStorage);
		const nativeTransport = new NativeStorageTransport(nativeStorage);

		// Put them in a proxy to allow for hot-swapping between them
		const proxyTransport = new ProxyStorageTransport([browserTransport, nativeTransport]);

		// Make a context that uses the proxy transport
		const context = new StorageContext(proxyTransport);

		expect(proxyTransport.target).toBe(browserTransport);
		expect(context.transport).toBe(proxyTransport);

		// Swap between transport targets seamlessly without affecting the context
		proxyTransport.target = nativeTransport;
		expect(proxyTransport.target).toBe(nativeTransport);

		// The transport will only change if the assignment value is in the transports array passed to the constructor.
		proxyTransport.target = null;
		expect(proxyTransport.target).toBe(nativeTransport);

		// Create entities and key-value-pairs with the context
		// See the StorageContext class for more options
		const userEmail = context.getKeyValuePair('userEmail');

		spyOn(nativeStorage, 'getItem').and.callFake(() => Promise.resolve('test@test.org'));

		// Load values by one transport
		const nativeStorageEmail = await userEmail.load();
		expect(nativeStorageEmail).toBe('test@test.org');

		proxyTransport.target = browserTransport;

		// Or by another, without any changes to the KVP instance or context instance
		const localStorageEmail = await userEmail.load('DNE'); // you can also pass in a default value
		expect(localStorageEmail).toBe('DNE');
	});

	it('allows for seamless hot-swapping between local storage and native storage', async () => {

		const {
			mockBrowserTransport,
			mockNativeTransport,
			proxyTransport,
			context
		} = createDefaults();

		proxyTransport.target = mockBrowserTransport;
		expect(proxyTransport.target).toBe(mockBrowserTransport);

		const proxyEntry = context.createEntity<number>('proxyEntry');

		const v1 = await proxyEntry.load(-1);
		expect(v1).toBe(-1);

		await proxyEntry.save(42);

		const v2 = await proxyEntry.load(-1);
		expect(v2).toBe(42);

		// Can be lifted multiple times from the same transport
		const v3 = await proxyEntry.load();
		expect(v3).toBe(42);

		proxyTransport.target = mockNativeTransport;

		// Returns default value now because we are pointing at a different transport
		const v4 = await proxyEntry.load(-1);
		expect(v4).toBe(-1);

		await proxyEntry.save(9001);

		proxyTransport.target = mockBrowserTransport;
		const browserValue = await proxyEntry.load();
		expect(browserValue).toBe(42);

		proxyTransport.target = mockNativeTransport;
		const nativeValue = await proxyEntry.load();
		expect(nativeValue).toBe(9001);

		await proxyEntry.clear();
		const nativeValueAfterClear = await proxyEntry.load(-1);
		expect(nativeValueAfterClear).toBe(-1);
	});
});