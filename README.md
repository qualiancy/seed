# Seed [![Build Status](https://secure.travis-ci.org/qualiancy/seed.png)](http://travis-ci.org/qualiancy/seed)

> Storage-agnostic Event Emitting Datasets

Seed is a library of components that provide a common API for working with sets of data, no matter the source.

* **Hashs** provide a thorough API for key:value sets. These sets can be simple string key to number value, or 
string key to object/document value. Hashs are used extensively througout the internals of the other components.
* **Schema**: A schema is a definition of data structure expecatations and are currently used for validation. Those
who have used Mongoose will find the API familiar.
* **Model**: A model defines all aspects and behavior related to a single instance in a set. More specifically, 
when used in conjunction with storage, a model represents one document in a collection or one row in a table. 
* **Graph**: A graph is a collection of instantiated models. Though similiar to Backbone Collections, a Graph
allows for logical groupings of several types of models.

### Some possible implementations:

* Realtime notifications of status updates on social networks.
* KPI monitoriing and alerts based on realtime sales data for shopping sites.
* Evented ETL network

## Installation

Package is available through [npm](http://npmjs.org).

    $ npm install seed

## Storage Engines

Seed comes with a Memory based storage engine. Need an alternative?

* [seed-redis](http://github.com/qualiancy/seed-redis) - Store your datasets in a [Redis](http://redis.io) database.
* [seed-mongodb](https://github.com/qualiancy/seed-mongodb) - Store your datasets in a [MongoDB](http://www.mongodb.org/) database.
* [seed-filestore](http://github.com/qualiancy/seed-filestore) - Store your datasets in a JSON based file structure.

## Roadmap

The 0.1.12 release is stable enough for small production usage. The upcoming 0.2.x (master branch) 
releases will focus on schemas, relationships, and performance.

## Where to Get Help

Please post issues to [GitHub Issues](https://github.com/logicalparadox/seed/issues).
Community forum is available at the [Google Group](https://groups.google.com/group/seedjs-orm).

## Components

Seed consists of four main components:

### Hash

### Schema

### Model

### Graph

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using the [Chai](http://chaijs.com)
`should` BDD assertion library. Make sure you have that installed, clone this repo, install dependacies using `npm install`.

    $ make test

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) if you are interested in being regular contributor.

* Jake Luer ([Github: @logicalparadox](http://github.com/logicalparadox)) ([Twitter: @jakeluer](http://twitter.com/jakeluer)) ([Website](http://alogicalparadox.com))

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
