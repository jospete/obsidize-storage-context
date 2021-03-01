import { StorageContext, BrowserStorageTransport } from '../src';

describe('Example Usage', () => {

	it('works as advertised', async () => {

		// ***** 1. Create a base context for your application

		// Note that while we are using localStorage for an example here, 
		// you could just as easily create your own transport via:
		// ```implements StorageTransportApiMask``` 
		const localStoragecontext = new StorageContext(new BrowserStorageTransport(localStorage));


		// ***** 2. Create module sub-contexts to isolate possible key duplicates

		const mod1Context = localStoragecontext.getSubContext('mod1');
		const mod1FeatureAContext = mod1Context.getSubContext('featureA');
		const mod1Addon = mod1Context.getSubContext('addOn');


		// ***** 3. Save and load some string data

		const userNameForFeatureA = mod1FeatureAContext.getKeyValuePair('userName');
		const userNameForAddon = mod1Addon.getKeyValuePair('userName');

		await userNameForFeatureA.save('John');
		await userNameForAddon.save('Johnny');

		const userNameForFeatureAValue = await userNameForFeatureA.load();
		const userNameForAddonValue = await userNameForAddon.load();

		expect(userNameForFeatureA.key).toBe('userName');
		expect(userNameForFeatureA.absoluteKey).toBe('mod1$featureA$userName');
		expect(userNameForFeatureAValue).toBe('John');

		expect(userNameForAddon.key).toBe('userName');
		expect(userNameForAddon.absoluteKey).toBe('mod1$addOn$userName');
		expect(userNameForAddonValue).toBe('Johnny');


		// ***** 4. Save and load some JSON data

		// We can use entities to serialize non-string primitives
		const userIdForAddon = mod1Addon.createEntity<number>('userId');

		expect(userIdForAddon.keyValuePair.key).toBe('userId');
		expect(userIdForAddon.keyValuePair.absoluteKey).toBe('mod1$addOn$userId');

		const loadedUserId = await userIdForAddon.load(0); // specify fallback value for keys that may not be stored yet
		expect(loadedUserId).toBe(0);

		await userIdForAddon.save(42);
		const loadedUserIdUpdate = await userIdForAddon.load(0);
		expect(loadedUserIdUpdate).toBe(42);

		interface UserPrefs {
			showNotifications: boolean;
			preferredName: string;
			subCount: number;
		}

		// We can also use entities to store traditional JSON data
		const userPrefsForAddon = mod1Addon.createEntity<UserPrefs>('userPrefs');

		expect(userPrefsForAddon.keyValuePair.key).toBe('userPrefs');
		expect(userPrefsForAddon.keyValuePair.absoluteKey).toBe('mod1$addOn$userPrefs');

		await userPrefsForAddon.save({ showNotifications: true, preferredName: 'Tony', subCount: 4 });
		const savedUserPrefs = await userPrefsForAddon.load();

		expect(savedUserPrefs).toEqual({ showNotifications: true, preferredName: 'Tony', subCount: 4 });


		// ***** 5. Save and load arrays with complex entries.

		// This is best used when your transport does not handle large strings well, 
		// and the serialized data must be broken into smaller parts.

		const addOnSerializedArray = mod1Addon.getSubContext('itemArray').createEntityArray<UserPrefs>();

		await addOnSerializedArray.save([
			{ showNotifications: true, preferredName: 'Bob', subCount: 0 },
			{ showNotifications: false, preferredName: 'Sally', subCount: 1 },
			{ showNotifications: false, preferredName: 'Frank', subCount: 2 },
		]);

		const serializedArrayValue = await addOnSerializedArray.load(); // returns the above content... you get the idea

		expect(serializedArrayValue).toEqual([
			{ showNotifications: true, preferredName: 'Bob', subCount: 0 },
			{ showNotifications: false, preferredName: 'Sally', subCount: 1 },
			{ showNotifications: false, preferredName: 'Frank', subCount: 2 },
		]);

		const addOnSecondEntry = addOnSerializedArray.get(1);

		expect(addOnSecondEntry.keyValuePair.key).toBe('1');
		expect(addOnSecondEntry.keyValuePair.absoluteKey).toBe('mod1$addOn$itemArray$1');

		const addOnSecondEntryValue = await addOnSecondEntry.load();

		expect(addOnSecondEntryValue).toEqual({ showNotifications: false, preferredName: 'Sally', subCount: 1 });
	});
});