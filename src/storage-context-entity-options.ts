import { getJSONSerializationDuplex, SerializationDuplex } from './serialization-duplex';

export interface StorageContextEntityOptions<V> {
	serializer: SerializationDuplex<V>;
}

export const getDefaultStorageContextEntityOptions = <V>(): StorageContextEntityOptions<V> => {
	return {
		serializer: getJSONSerializationDuplex<V>()
	};
};