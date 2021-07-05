import { StorageTransportApiMask } from './storage-transport-api-mask';

/**
 * Special aggregator that allows for transport hot-swapping.
 */
export class ProxyStorageTransport implements StorageTransportApiMask {

	private mFocusIndex: number = 0;

	constructor(
		private readonly transports: StorageTransportApiMask[]
	) {
	}

	public get target(): StorageTransportApiMask {
		return this.transports[this.mFocusIndex];
	}

	public set target(value: StorageTransportApiMask) {
		this.mFocusIndex = Math.max(this.transports.indexOf(value), 0);
	}

	public getItem(key: string): Promise<string | null | undefined> {
		return this.target.getItem(key);
	}

	public setItem(key: string, value: string): Promise<void> {
		return this.target.setItem(key, value);
	}

	public removeItem(key: string): Promise<void> {
		return this.target.removeItem(key);
	}

	public clear(): Promise<void> {
		return this.target.clear();
	}

	public keys(): Promise<string[]> {
		return this.target.keys();
	}
}