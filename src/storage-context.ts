import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContext<T extends StorageTransportApiMask> implements StorageTransportApiMask {

	constructor(
		public readonly transport: T
	) {
	}

	public getItem(key: string): Promise<string> {
		return this.transport.getItem(this.getAbsoluteKey(key));
	}

	public setItem(key: string, value: string): Promise<void> {
		return this.transport.setItem(this.getAbsoluteKey(key), value);
	}

	public removeItem(key: string): Promise<void> {
		return this.transport.removeItem(this.getAbsoluteKey(key));
	}

	public clear(): Promise<void> {
		return this.transport.clear();
	}

	public async keys(): Promise<string[]> {
		const keys = await this.transport.keys();
		const prefix = this.absoluteKeyPrefix;
		const sanitizedKeys: string[] = [].slice.call(keys);
		return sanitizedKeys.filter(k => k && k.startsWith(prefix));
	}

	public getAbsoluteKey(relativeKey: string): string {
		return this.absoluteKeyPrefix + relativeKey;
	}

	public get absoluteKeyPrefix(): string {
		return '';
	}

	public createSubContext(prefix: string, options?: any): StorageContext<StorageContext<T>> {
		return new StorageContext(this);
	}
}