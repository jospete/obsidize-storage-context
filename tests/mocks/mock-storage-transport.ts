import { BrowserStorageTransport, MockBrowserStorage } from '../../src';

export class MockStorageTransport extends BrowserStorageTransport {

	public readonly mockStorage: MockBrowserStorage;

	constructor() {
		const storage = new MockBrowserStorage();
		super(storage);
		this.mockStorage = storage;
	}
}