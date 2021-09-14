import { BrowserStorageTransport, IonicNativeStorageTransport, MockBrowserStorage, MockIonicNativeStorage, ProxyStorageTransport, StorageContext } from '../src';

describe('Example Ionic Native Storage Proxy', () => {

	const createDefaults = () => {

		const mockBrowserTransport = new BrowserStorageTransport(new MockBrowserStorage());
		const mockNativeTransport = new IonicNativeStorageTransport(new MockIonicNativeStorage(new MockBrowserStorage()));

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