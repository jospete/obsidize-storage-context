import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { IonicNativeStorageTransport } from '../src';

describe('IonicNativeStorageTransport', () => {

	it('is a mask for the ionic native NativeStorage plugin', async () => {

		const nativeStorage = new NativeStorage();
		const nativeTransport = new IonicNativeStorageTransport(nativeStorage);

		spyOn(nativeStorage, 'getItem');
		nativeTransport.getItem('test');
		expect(nativeStorage.getItem).toHaveBeenCalled();

		spyOn(nativeStorage, 'setItem');
		nativeTransport.setItem('test', 'blah');
		expect(nativeStorage.setItem).toHaveBeenCalled();

		spyOn(nativeStorage, 'remove');
		nativeTransport.removeItem('test');
		expect(nativeStorage.remove).toHaveBeenCalled();

		spyOn(nativeStorage, 'clear');
		nativeTransport.clear();
		expect(nativeStorage.clear).toHaveBeenCalled();

		spyOn(nativeStorage, 'keys');
		nativeTransport.keys();
		expect(nativeStorage.keys).toHaveBeenCalled();
	});
});