import { BrowserStorageTransport, IonicNativeStorageTransport, MockBrowserStorage, MockIonicNativeStorage, ProxyStorageTransport } from '../src';

describe('Example Ionic Native Storage Proxy', () => {

	const createDefaults = () => {

		const mockBrowserTransport = new BrowserStorageTransport(new MockBrowserStorage());
		const mockNativeTransport = new IonicNativeStorageTransport(new MockIonicNativeStorage(new MockBrowserStorage()));

		const proxyTransport = new ProxyStorageTransport([
			mockBrowserTransport,
			mockNativeTransport
		]);

		return {
			mockBrowserTransport,
			mockNativeTransport,
			proxyTransport
		};
	};

	it('allows for seamless hot-swapping between local storage and native storage', async () => {

	});
});