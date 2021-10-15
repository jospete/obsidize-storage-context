import { BrowserStorageTransport, StorageMap } from '../../src';

export class MockStorageTransport extends BrowserStorageTransport {

	public readonly mockStorage: StorageMap;

	constructor() {
		const storage = new StorageMap();
		super(storage);
		this.mockStorage = storage;
	}
}