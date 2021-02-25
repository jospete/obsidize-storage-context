import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';
import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { SerializationDuplex } from './serialization-duplex';

/**
 * Represents a complex (probably JSON) entity that 
 * can be serialized to and deserialized from a string.
 */
export class StorageContextEntity<V, T extends StorageTransportApiMask> {

	constructor(
		public readonly entry: StorageContextKeyValuePair<T>,
		public readonly options: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public get serializer(): SerializationDuplex<V> {
		return this.options.serializer;
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