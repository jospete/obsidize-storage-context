import { getDefaultStorageContextEntityOptions, StorageContextEntityOptions } from './storage-context-entity-options';
import { StorageContextKeyValuePair } from './storage-context-key-value-pair';
import { SerializationDuplex } from './serialization-duplex';

/**
 * Represents a complex (probably JSON) entity that 
 * can be serialized to and deserialized from a string.
 */
export class StorageContextEntity<V> {

	constructor(
		public readonly keyValuePair: StorageContextKeyValuePair,
		public readonly options: StorageContextEntityOptions<V> = getDefaultStorageContextEntityOptions<V>()
	) {
	}

	public get serializer(): SerializationDuplex<V> {
		return this.options.serializer;
	}

	public clear(): Promise<void> {
		return this.keyValuePair.clear();
	}

	public save(value: V): Promise<void> {
		return this.keyValuePair.save(this.serializer.serialize(value));
	}

	public async load(defaultValue?: V): Promise<V> {
		const storedValue = await this.keyValuePair.load();
		return this.serializer.deserialize(storedValue as any, defaultValue);
	}
}