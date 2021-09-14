import { StorageTransportApiMask } from '../core/storage-transport-api-mask';

// Taken from here - https://github.com/ionic-team/ionic-native/blob/master/src/%40ionic-native/plugins/native-storage/index.ts
export interface IonicNativeStorageLike {
	setItem(reference: string, value: any): Promise<any>;
	getItem(reference: string): Promise<any>;
	keys(): Promise<any>;
	remove(reference: string): Promise<any>;
	clear(): Promise<any>;
}

/**
 * Wraps synchronous storage with the necessary api mask methods.
 */
export class IonicNativeStorageTransport implements StorageTransportApiMask {

	constructor(
		protected readonly source: IonicNativeStorageLike
	) {
	}

	public getItem(key: string): Promise<string | null | undefined> {
		return this.source.getItem(key);
	}

	public setItem(key: string, value: string): Promise<void> {
		return this.source.setItem(key, value);
	}

	public removeItem(key: string): Promise<void> {
		return this.source.remove(key);
	}

	public clear(): Promise<void> {
		return this.source.clear();
	}

	public keys(): Promise<string[]> {
		return this.source.keys();
	}
}