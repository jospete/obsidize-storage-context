import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Wraps synchronous storage with the necessary api mask methods.
 */
export class BrowserStorageTransport implements StorageTransportApiMask {

	constructor(
		public readonly source: Storage
	) {
	}

	public async getItem(key: string): Promise<string> {
		return this.source.getItem(key) as any;
	}

	public async setItem(key: string, value: string): Promise<void> {
		this.source.setItem(key, value);
	}

	public async removeItem(key: string): Promise<void> {
		this.source.removeItem(key);
	}

	public async clear(): Promise<void> {
		this.source.clear();
	}

	public async keys(): Promise<string[]> {

		const len = this.source.length;
		const result: string[] = [];

		for (let i = 0; i < len; i++) {
			result[i] = this.source.key(i) as any;
		}

		return result;
	}
}