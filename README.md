# ConCaVa JSON adapter

> ConCaVa adapter for authorization, metadata and storage using JSON files.

This adapter uses the [simple JSON file store](https://www.npmjs.com/package/jfs).

Requires ConCaVa v0.6+.

## Install

```bash
npm install concava-adapter-json
```

## Configure

A ConCaVa configuration example:

```js
const path = require('path')
const adapter = require('concava-adapter-json')

module.exports = {
	debug: true,
	logFile: '/tmp/output.log',
	logName: 'concava',
	port: 3000,
	payloadMaxSize: '512kb',
	auth: {
		enabled: true,
		header: 'Authorization',
		byToken: true,
		method: adapter.auth,
		file: path.resolve('./data/tokens.json'),
	},
	metadata: {
		method: adapter.metadata,
		file: path.resolve('./data/metadata.json'),
	},
	storage: {
		method: adapter.storage,
		path: path.resolve('./data/'),
	},
}
```

Data will be stored in the storage path using the following file format: `store.{udid}.json`.

## License

This software is licensed under the [MIT license](https://github.com/kukua/concava-adapter-json/blob/master/LICENSE).

© 2016 Kukua BV
