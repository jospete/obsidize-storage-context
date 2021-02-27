# @obsidize/storage-context

Utilities to enhance and organize complex sets of data on top of simple key/value systems like localStorage.

The primary goals of this module are:

- to eliminate "loose strings" that tend to accompany complex storage mechanisms
- to flatten complex data sets into atomic key/value pairs that can be persisted on any synchronous / asynchronous / local / remote transport layer

**BEFORE:**

```typescript

try {
	const localToken = JSON.parse(localStorage.getItem('appData$featureA$token'));
	const {id, userId} = localToken;
	const serializedCloudPrefs = JSON.stringify({id, userId});
	await saveOverHttp('appData$featureA$token', serializedCloudPrefs);
	console.log('saved to http server: ' + serializedCloudPrefs);

} catch (e) {
	console.error('failed to parse token: ', e);
}



```

**AFTER:**

```typescript



```

## Usage

The main benefit of this wrapper library is that it can break apart arrays of complex/large data schemas into separate entries under the hood.
The general context constructs are also extendable to meet general client needs.

```typescript
import { BrowserStorageTransport, StorageContext, SerializedEntityArray } from '@obsidize/storage-context';

interface EntityData {
	value: string;
}

const localStoragecontext = new StorageContext(new BrowserStorageTransport(localStorage));
const arrayContext = localStoragecontext.getSubContext('arrayOfItems');
const entityArray = arrayContext.createEntityArray<EntityData>();

const dummyData = [{value: 'test1'}, {value: 'anotherItem'}, {value: null}];
await entityArray.save(dummyData);

// context-based key nesting
const secondEntity = entityArray.get(1);
console.log(secondEntity.entry.key); // 1
console.log(secondEntity.entry.absoluteKey); // arrayOfItems$1
console.log(entityArray.size); // 3
```

## Context Isolation