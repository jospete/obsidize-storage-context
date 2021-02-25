/**
 * Utility to enforce the existence of map entries that have not yet been created.
 */
export const findOrCreateMapEntry = <K, V>(map: Map<K, V>, key: K, create: () => V): V => {

	let entry = map.get(key);

	if (typeof entry === 'undefined') {
		entry = create();
		map.set(key, entry);
	}

	return entry;
};