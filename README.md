# @obsidize/storage-context

Utilities to enhance and organize complex sets of data on top of simple key/value systems like localStorage.

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