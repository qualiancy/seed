# Seed [![Build Status](https://secure.travis-ci.org/qualiancy/seed.png)](http://travis-ci.org/qualiancy/seed)

> A storage-agnostic graphing database framework.

Seed is a suite of components (Graph, Model, Schema, Hash) that provide a common API for working with JSON-style 
documents, regardless of the storage engine. Additionally, Seed can layer a graph structure to facilitate the 
traversal of data relationships between documents of the same or different model types.

- **Hash**: A thorough API for non-persistent key:value sets. These sets can be simple string key to number value, or 
string key to object/document value. Hashs are used extensively througout the internals of the other components.
- **Schema**: A schema is a definition of data structure expecatations and are currently used for validation. Those
who have used Mongoose will find the API familiar.
- **Model**: A model defines all aspects and behavior related to a single data object in a set. More specifically, 
when used in conjunction with storage, a model represents one document in a collection or one row in a table. 
- **Graph**: A graph is a collection of instantiated models. A graph allows for logical groupings of several 
types of models, querying of storage, and traversal of model relationships. 

_Note: Documentation website in progress. Hold tight._

### Projects Using Seed

- [Kinetik](http://kinetik.qualiancy.com) is tag centric job queue for distributed applications.

Other possible implementations:

- Realtime notifications of status updates on social networks.
- KPI monitoriing and alerts based on realtime sales data for shopping sites.
- Evented ETL network

## Installation

Package is available through [npm](http://npmjs.org).

    $ npm install seed

## Storage Engines

Seed comes with a Memory based storage engine. Need an alternative?

- [seed-redis](http://github.com/qualiancy/seed-redis) - Store your datasets in a 
[Redis](http://redis.io) database.
- [seed-mongodb](https://github.com/qualiancy/seed-mongodb) - Store your datasets 
in a [MongoDB](http://www.mongodb.org/) database.
- [seed-riak](https://github.com/qualiancy/seed-riak) - Store your datasets in
a [Riak](http://wiki.basho.com/Riak.html) database. (Seed 0.3.x only)

CouchDB coming very soon.

## Roadmap

The current release (0.4.x) is production ready for small to medium size projects. The next release will
focus on expanding on schema validation options and the graph traversal language. Also, be on the 
lookout for a kick-ass documentation website.

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using the [Chai](http://chaijs.com)
`should` BDD assertion library. Make sure you have that installed, clone this repo, install dependacies 
using `npm install`.

    $ make test

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) 
if you are interested in being regular contributor.

* Jake Luer ([@logicalparadox](http://github.com/logicalparadox))

## License

(The MIT License)

Copyright (c) 2011-2012 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
