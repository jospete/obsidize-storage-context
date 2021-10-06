# @obsidize/storage-context

Utilities to enhance and organize complex sets of data on top of simple key/value systems like localStorage.

The primary goals of this module are:

- to eliminate "loose strings" that tend to accompany complex storage mechanisms
- to flatten complex data sets into atomic key/value pairs that can be persisted on any synchronous / asynchronous / local / remote transport layers.

The benefits of this module really kick in for large, complex datasets that may need to persist across multiple transports.

If you just need to save 3 string values to localStorage, you probably don't need this module.

## Installation

- npm:

```bash
npm install --save @obsidize/storage-context
```

- git:

```bash
npm install --save git+https://github.com/jospete/obsidize-storage-context.git
```

## Usage

### Example

```typescript
import { BrowserStorageTransport, StorageContext } from '@obsidize/storage-context';

const browserTransport = new BrowserStorageTransport(localStorage);
const baseContext = new StorageContext(browserTransport);
const context = baseContext.getSubContext('namespace_for_your_feature');

const userEmail = context.getKeyValuePair('userEmail');
console.log(userEmail.absoluteKey); // 'namespace_for_your_feature$userEmail';

const userId = context.createEntity<number>('userId');
console.log(userId.keyValuePair.absoluteKey); // 'namespace_for_your_feature$userId';

const emailValue = await userEmail.load('Does Not Exist');
console.log(emailValue); // 'Does Not Exist'

await userEmail.save('test@test.org');
const emailValue2 = await userEmail.load('Does Not Exist');
console.log(emailValue2); // 'test@test.org'

const userIdValue = await userId.load(-1);
console.log(userIdValue); // -1

await userId.save(42);
const userIdValue2 = await userId.load(-1);
console.log(userIdValue2); // 42
console.log(typeof userIdValue2); // 'number'
```

See the [Example Usage Spec](https://github.com/jospete/obsidize-storage-context/blob/master/tests/example-usage.spec.ts) to get a general feel for what this module can do.

See the [Native Proxy Spec](https://github.com/jospete/obsidize-storage-context/blob/master/tests/example-native-storage-proxy.spec.ts) for an example of hot-swapping transports.

## API

Source documentation can be found [here](https://jospete.github.io/obsidize-storage-context/)