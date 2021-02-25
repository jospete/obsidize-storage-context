import { StorageTransportApiMask } from '../src';

export class MockStorageTransport implements StorageTransportApiMask {

	public storageContents: { [key: string]: string } = {};

	public async getItem(key: string): Promise<string> {
		return this.storageContents[key];
	}

	public async setItem(key: string, value: string): Promise<void> {
		this.storageContents[key] = value;
	}

	public async removeItem(key: string): Promise<void> {
		delete this.storageContents[key];
	}

	public async clear(): Promise<void> {
		this.storageContents = {};
	}

	public async keys(): Promise<string[]> {
		return Object.keys(this.storageContents);
	}
}