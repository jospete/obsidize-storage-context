import { StorageContext } from '../src';
import { MockStorageTransport } from './mock-storage-transport';

export class MockStorageBaseContext extends StorageContext<MockStorageTransport> {

	public readonly mockTransport: MockStorageTransport;

	constructor() {
		const transport = new MockStorageTransport();
		super(transport);
		this.mockTransport = transport;
	}
}