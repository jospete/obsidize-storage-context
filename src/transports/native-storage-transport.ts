import { StorageTransportApiMask } from '../core/storage-transport-api-mask';

/**
 * Native Storage interface inspired by the native-storage cordova plugin wrapper here:
 * https://github.com/danielsogl/awesome-cordova-plugins/blob/master/src/%40awesome-cordova-plugins/plugins/native-storage/index.ts
 */
export interface NativeStorageLike {
	setItem(reference: string, value: any): Promise<any>;
	getItem(reference: string): Promise<any>;
	keys(): Promise<any>;
	remove(reference: string): Promise<any>;
	clear(): Promise<any>;
}

/**
 * Wraps synchronous storage with the necessary api mask methods.
 */
export class NativeStorageTransport implements StorageTransportApiMask {

	constructor(
		protected readonly source: NativeStorageLike
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