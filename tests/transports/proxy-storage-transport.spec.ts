import { BrowserStorageTransport, StorageMap, ProxyStorageTransport } from '../../src';

describe('ProxyStorageTransport', () => {

	const createDefaults = () => {

		const mockLocalTransportA = new BrowserStorageTransport(new StorageMap());
		const mockLocalTransportB = new BrowserStorageTransport(new StorageMap());

		const proxyTransport = new ProxyStorageTransport([
			mockLocalTransportA,
			mockLocalTransportB
		]);

		return {
			mockLocalTransportA,
			mockLocalTransportB,
			proxyTransport
		};
	};

	it('is a shallow pass-through for core transport functionality', async () => {

		const {
			mockLocalTransportA,
			proxyTransport
		} = createDefaults();

		spyOn(mockLocalTransportA, 'getItem').and.callThrough();
		await proxyTransport.getItem('test');
		expect(mockLocalTransportA.getItem).toHaveBeenCalled();

		spyOn(mockLocalTransportA, 'setItem').and.callThrough();
		await proxyTransport.setItem('test', 'value');
		expect(mockLocalTransportA.setItem).toHaveBeenCalled();

		spyOn(mockLocalTransportA, 'removeItem').and.callThrough();
		await proxyTransport.removeItem('test');
		expect(mockLocalTransportA.removeItem).toHaveBeenCalled();

		spyOn(mockLocalTransportA, 'clear').and.callThrough();
		await proxyTransport.clear();
		expect(mockLocalTransportA.clear).toHaveBeenCalled();

		spyOn(mockLocalTransportA, 'keys').and.callThrough();
		await proxyTransport.keys();
		expect(mockLocalTransportA.keys).toHaveBeenCalled();
	});

	it('allows for hot-swapping between multiple transports', async () => {

		const {
			mockLocalTransportA,
			mockLocalTransportB,
			proxyTransport
		} = createDefaults();

		spyOn(mockLocalTransportA, 'getItem').and.callThrough();
		spyOn(mockLocalTransportB, 'getItem').and.callThrough();
		await proxyTransport.getItem('test');

		expect(mockLocalTransportA.getItem).toHaveBeenCalled();
		expect(mockLocalTransportB.getItem).not.toHaveBeenCalled();

		proxyTransport.target = mockLocalTransportB;
		expect(proxyTransport.target).toBe(mockLocalTransportB);
		await proxyTransport.getItem('test');

		expect(mockLocalTransportA.getItem).toHaveBeenCalledTimes(1);
		expect(mockLocalTransportB.getItem).toHaveBeenCalledTimes(1);
	});
});