import { StorageTransportApiMask } from './storage-transport-api-mask';

export class StorageContextEntry<T extends StorageTransportApiMask> {

	private mValue: string = '';

	constructor(
		public readonly transport: T,
		public readonly key: string
	) {
	}

	public get value(): string {
		return this.mValue;
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