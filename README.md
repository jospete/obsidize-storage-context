# @obsidize/storage-context

Utilities to enhance and organize complex sets of data on top of simple key/value systems like localStorage.

The primary goals of this module are:

- to eliminate "loose strings" that tend to accompany complex storage mechanisms
- to flatten complex data sets into atomic key/value pairs that can be persisted on any synchronous / asynchronous / local / remote transport layers.

The benefits of this module really kick in for large, complex datasets that may need to persist across multiple transports.

If you just need to save 3 string values to localStorage, you probably don't need this module.

## API

Source documentation can be found [here](https://jospete.github.io/obsidize-storage-context/)

## Usage

The main benefit of this wrapper library is that it can break apart arrays of complex/large data schemas into separate entries under the hood,
and maintain context references that automatically build flattened absolute key paths in the background.

See the [Example Usage Spec](https://github.com/jospete/obsidize-storage-context/blob/master/tests/example-usage.spec.ts) to get a general feel for what this module can do.

See the [Ionic Proxy Spec](https://github.com/jospete/obsidize-storage-context/blob/master/tests/example-ionic-storage-proxy.spec.ts) for an example of hot-swapping transports.