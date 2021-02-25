import { StorageContextEntity } from './storage-context-entity';
import { StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContextKeyValuePair<T extends StorageTransportApiMask> {

	private mValue: string = '';

	constructor(
		public readonly transport: T,
		public readonly key: string
	) {
	}

	public get value(): string {
		return this.mValue;
	}

	public asEntity<V>(options?: StorageContextEntityOptions<V>): StorageContextEntity<V, T> {
		return new StorageContextEntity(this, options);
	}

	public save(update: string): Promise<void> {
		this.mValue = update;
		return this.transport.setItem(this.key, this.value);
	}

	public async load(): Promise<string> {
		this.mValue = await this.transport.getItem(this.key);
		return this.value;
	}

	public clear(): Promise<void> {
		return this.transport.removeItem(this.key);
	}
}