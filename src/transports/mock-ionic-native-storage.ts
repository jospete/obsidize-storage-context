import { BrowserStorageTransport } from './browser-storage-transport';
import { IonicNativeStorageLike } from './ionic-native-storage-transport';

/**
 * Utility for faking ionic native storage interface.
 */
export class MockIonicNativeStorage extends BrowserStorageTransport implements IonicNativeStorageLike {

	public remove(reference: string): Promise<any> {
		return this.removeItem(reference);
	}
}