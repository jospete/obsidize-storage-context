import { StorageTransportApiMask } from './storage-transport-api-mask';
import { StorageContextEntry } from './storage-context-entry';
import { getJSONSerializationDuplex, SerializationDuplex } from './serialization-duplex';

export class StorageContextPipe<V, T extends StorageTransportApiMask> {

	constructor(
		public readonly entry: StorageContextEntry<T>,
		public readonly serializer: SerializationDuplex<V> = getJSONSerializationDuplex<V>()
	) {
	}

	public get value(): V {
		return this.serializer.deserialize(this.entry.value);
	}

	public clear(): Promise<void> {
		return this.entry.clear();
	}

	public save(value: V): Promise<void> {
		return this.entry.save(this.serializer.serialize(value));
	}

	public async load(): Promise<V> {
		await this.entry.load();
		return this.value;
	}
}