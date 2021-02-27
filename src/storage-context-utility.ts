export namespace StorageContextUtility {

	export function isUndefined(v: any): boolean {
		return typeof v === 'undefined';
	}

	export function optDefined<T>(value: T, fallback: T): T {
		return isUndefined(value) ? fallback : value;
	}

	export function toArray<V>(value: any): V[] {
		return [].slice.call(value) as V[];
	}

	export function bombShield<T>(action: () => T, fallbackValue?: T): T {

		try {
			return action();

		} catch (err) {
			return optDefined(fallbackValue, err);
		}
	}

	export function findOrCreateMapEntry<K, V>(map: Map<K, V>, key: K, create: (key: K, map: Map<K, V>) => V): V {

		let entry = map.get(key);

		if (isUndefined(entry)) {
			entry = create(key, map);
			map.set(key, entry);
		}

		return entry as V;
	}
}