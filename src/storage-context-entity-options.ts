import { getJSONSerializationDuplex, SerializationDuplex } from './serialization-duplex';

/**
 * Customization options that can be given to any entity instance.
 */
export interface StorageContextEntityOptions<V> {
	readonly serializer: SerializationDuplex<V>;
}

/**
 * Standard fallback options generator for all instances that are not given explicit options.
 */
export const getDefaultStorageContextEntityOptions = <V>(): StorageContextEntityOptions<V> => {
	return {
		serializer: getJSONSerializationDuplex<V>()
	};
};