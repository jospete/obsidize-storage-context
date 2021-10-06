import { BrowserStorageTransport } from './browser-storage-transport';
import { NativeStorageLike } from './native-storage-transport';

/**
 * Utility for faking native storage interface.
 */
export class MockNativeStorage extends BrowserStorageTransport implements NativeStorageLike {

	public remove(reference: string): Promise<any> {
		return this.removeItem(reference);
	}
}