import { BrowserStorageTransport } from './browser-storage-transport';
import { NativeStorageLike } from './native-storage-transport';
import { StorageMap } from './storage-map';

/**
 * Utility for faking the native storage interface.
 */
export class MockNativeStorage extends BrowserStorageTransport implements NativeStorageLike {

	constructor(storage: Storage = new StorageMap()) {
		super(storage);
	}

	public remove(reference: string): Promise<any> {
		return this.removeItem(reference);
	}
}