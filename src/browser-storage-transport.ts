import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Wraps synchronous storage with the necessary api mask methods.
 */
export class BrowserStorageTransport implements StorageTransportApiMask {

	constructor(
		public readonly source: Storage
	) {
	}

	public getItem(key: string): Promise<string | null | undefined> {
		return Promise.resolve(this.source.getItem(key));
	}

	public setItem(key: string, value: string): Promise<void> {
		return Promise.resolve(this.source.setItem(key, value));
	}

	public removeItem(key: string): Promise<void> {
		return Promise.resolve(this.source.removeItem(key));
	}

	public clear(): Promise<void> {
		return Promise.resolve(this.source.clear());
	}

	public keys(): Promise<string[]> {

		const len = this.source.length;
		const result: string[] = [];

		for (let i = 0; i < len; i++) {
			result[i] = this.source.key(i) as any;
		}

		return Promise.resolve(result);
	}
}