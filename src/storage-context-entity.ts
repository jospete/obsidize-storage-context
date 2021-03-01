import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageTransportApiMask } from './storage-transport-api-mask';
import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { SerializationDuplex } from './serialization-duplex';

/**
 * Simplified type for generic use-cases.
 */
export type SerializedEntity<V> = StorageContextEntity<V, StorageTransportApiMask>;

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

	public clear(): Promise<void> {
		return this.entry.clear();
	}

	public save(value: V): Promise<void> {
		return this.entry.save(this.serializer.serialize(value));
	}

	public async load(defaultValue?: V): Promise<V> {
		const storedValue = await this.entry.load();
		return this.serializer.deserialize(storedValue as any, defaultValue);
	}
}