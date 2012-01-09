# Seed [![Build Status](https://secure.travis-ci.org/qualiancy/seed.png)](http://travis-ci.org/qualiancy/seed)

## Storage-agnostic Event Emitting Datasets

Seed provides an API for working with datasets. The data can be continous streams of data or large tables
of metrics. At it's heart Seed is an event based ORM tool, but it will also allow for realtime analysis,
aggregation, and whatnot. The focus is to allow for datasets from many sources to be modeled, monitored,
analyzed, and acted upon.

### Some possible implementations:

* Realtime notifications of status updates on social networks.
* KPI monitoriing and alerts based on realtime sales data for shopping sites.
* Evented ETL network
* ... are you using it? Message [@logicalparadox](http://github.com/logicalparadox) with your use cases.

## Installation

Package is available through [npm](http://npmjs.org).

    $ npm install seed

## Components

Seed consists of four main components:

### Hash

### Schema

### Model

### Graph

## Storage Engines

Seed comes with a Memory based storage engine. Need an alternative?

* [seed-filestore](http://github.com/logicalparadox) - Store your datasets in a JSON based file structure.

## Where to Get Help

Please post issues to [GitHub Issues](https://github.com/logicalparadox/seed/issues).
Community forum is available at the [Google Group](https://groups.google.com/group/seedjs-orm).

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