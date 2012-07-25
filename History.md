
0.4.4 / 2012-07-25 
==================

  * update package dependancies

0.4.3 / 2012-07-03 
==================

  * recommit Hash#sortBy
  * add notes on traversal to readme
  * add readme link to kinetik

0.4.2 / 2012-06-28 
==================

  * update breeze dependancy

0.4.1 / 2012-06-26 
==================

  * replace SeedError with dragonfly errors

0.4.0 / 2012-06-25 
==================

  * Merge branch 'refactor/basehash'
  * update all require references to hash to point to base hash
  * move hash to base as its no longer a core constructor
  * Merge branch 'feature/loadvert'
  * loadref can function without graph present if incoming model is of same type
  * add model `loadRef` as model dbref loader
  * Tests for #8
  * model construction forge merge. Closes #8.
  * model set/merge/save/fetch cleanup
  * Merge branch 'refactor/hash'
  * using sol as basis for hash
  * using sol 0.2.x
  * added sol dependancy
  * Merge branch 'refactor/use-super'
  * graph traversal and commands using super
  * schema type using super
  * base extenders using super
  * removed utilts/object/eextend in favor of super supported self extension
  * graph using super
  * model using super
  * store uses super
  * schema using super
  * hash using super instead of node.utils
  * add super dependancy
  * Merge branch 'refactor/flow'
  * fix bug blocking Graph#fetch
  * graph model uses breeze for flow control
  * graph edge/vertice traversal can support empty input
  * clean up select graph traversal
  * graph traverse edges refactored to use base
  * graph traversal vertices use proper flow
  * graph refactored to use queue from breeze
  * rename emptyFn to noop
  * using async nextTick in memorystore
  * remove old flow utils, include breeze as `async` as base/async, add to main export
  * use breeze as base/flow
  * add breeze, update filtr

0.3.5 / 2012-06-11 
==================

  * queue flow utility calls callback immediately if queue is empty
  * refactor memory store to not error on non-existent group
  * test for empty traversal

0.3.4 / 2012-06-11 
==================

  * update drip to 0.3.x
  * test for graph set using schema

0.3.3 / 2012-05-30 
==================

  * added ObjectId schema type
  * MemoryStore is simulates async using nextTick
  * tests for Hash#reduce and Hash#mapReduce
  * Hash#mapReduce
  * Hash#reduce
  * bug - Graph#set wasn't setting object id before returning newly constructed model

0.3.2 / 2012-05-27 
==================

  * graph fetched models pass into schema validation
  * bug - if model has schema, use schema#getValue to ensure correct format

0.3.1 / 2012-05-25 
==================

  * clean npm ignore
  * bug - object schema type getValue returned circular reference

0.3.0 / 2012-05-25 
==================

  * test coverage support
  * case sensitive #2
  * case sensitive
  * no longer checking versions
  * Merge branch 'feature/graph-theory'
  * refactor command vertices for proper callback structure
  * improved Queue flow helper
  * graph edge fetching uses DBRef schema type to ensure clean references
  * model schema detection typo
  * DBRef schema type supports bson format
  * refactor Queue flow utility to use start + callback
  * tests for in vertices live
  * refactor vertices traversal to use base and smarter concurrency
  * parallel flow bug
  * tests for live out vertices
  * refactored outVertices to support live traversal
  * refactored edge model fetch x/y methods
  * tests for live in Edges
  * allow a queue to be cancelled
  * Graph#traverse `inEdges` command supports live mode
  * finished tests for Graph#traverse `live` out edges command
  * graph helper fetchEdges now properly works with dbrefs
  * Store#sync abides to Model schemas
  * Graph edge compatible with object type and Schema#getValue
  * added Schema#getValue to allow for "prepared" model attributes
  * nested deepMerge bug fix for undefined properties
  * added schema type `object` tests
  * added schema type `object`
  * Schema Types all have #getValue helper
  * starting tests for live traversals
  * Graph traverse command outEdges can do live queries
  * relations example using memory store
  * Graph#flush also flushes edges if we are flushing everything
  * test for deep merging
  * deep merge utility
  * [bug] Graph#set using existing model needs to set parent
  * refactor Graph helper to fetch edges to support x/y/undef  type of pulls
  * clean up Graph#each / flush
  * graph helpers comment header
  * [refactor] graph private functions into helper dependancy
  * traverse and should return instance of hash
  * static traversal tests
  * Graph#traverse doesn't automatically select
  * [bug] pull only pull non-new .. needed way to overwrite using option.force
  * Graph private helper functions :: getEdge and pullEdge
  * graph pull edges non-new
  * comment cleanup
  * [bug] fulfilled misspelled
  * DRY Graph `refreshLookups`
  * code styling for graph traversal
  * Merge branch 'feature/graph-theory' of github.com:qualiancy/seed into feature/graph-theory
  * starting graph traversal tests
  * [refactor] Graph#push // Graph#pull to use flow concurrency queue and refresh lookups
  * graph clean up
  * renamed test files for easier group running
  * refactored relations example
  * Added Traversal#flag. Refactored so parent is a flag.
  * util flow Queue tests
  * added util flow Queue
  * changed flow util `waterfall` to `concurrent` as it inappropriately named
  * update relations example
  * traverse command inEdges
  * traverse command outEdges
  * traverse command inVertices
  * traverse command loader
  * traverse command outVertices
  * Graph#traverse command
  * starting graph traversal. Traversal object
  * added async flow control utils
  * edge model loading vertices
  * [bug] Graph!#refreshLookups also cleans Graph#_edges lookups
  * [feature] Graph#relate / Graph#unrelate + Edge Model
  * [feature] Model#validate as public method for self schema validation
  * [bug] SchemaType#DBRef validates for returned dbref values
  * [refactor] Graph internally stores constructed models in `_vertices`
  * [feature] Schema.Type.DBRef include property getter `value`
  * [feature] added SchemaType.DBRef
  * starting graph traversal tests
  * [refactor] Graph#push // Graph#pull to use flow concurrency queue and refresh lookups
  * graph clean up
  * renamed test files for easier group running
  * refactored relations example
  * Added Traversal#flag. Refactored so parent is a flag.
  * util flow Queue tests
  * added util flow Queue
  * changed flow util `waterfall` to `concurrent` as it inappropriately named
  * update relations example
  * traverse command inEdges
  * traverse command outEdges
  * traverse command inVertices
  * traverse command loader
  * traverse command outVertices
  * Graph#traverse command
  * starting graph traversal. Traversal object
  * added async flow control utils
  * edge model loading vertices
  * [bug] Graph!#refreshLookups also cleans Graph#_edges lookups
  * [feature] Graph#relate / Graph#unrelate + Edge Model
  * [feature] Model#validate as public method for self schema validation
  * [bug] SchemaType#DBRef validates for returned dbref values
  * [refactor] Graph internally stores constructed models in `_vertices`
  * [feature] Schema.Type.DBRef include property getter `value`
  * [feature] added SchemaType.DBRef

0.2.5-1 / 2012-04-27 
==================

  * Model.store getter checks parent too

0.2.5 / 2012-04-27 
==================

  * [bug] Schema#validatePath was throwing a reference error
  * Merge branch 'feature/graph-theory'
  * [refactor] file restructure
  * [refactor] code clean for Graph/Model
  * [refactor] Graph/Model # toString
  * [feature] Graph now has type (same implementation as model)
  * [refactor] clean up relation prototype
  * [feature] added Model.prototype.DBRef helper
  * [feature] basic relations Graph
  * [example] graph relationships
  * Merge branch 'feature/relations'
  * [refactor] file restructure
  * [refactor] code clean for Graph/Model
  * [refactor] Graph/Model # toString
  * [feature] Graph now has type (same implementation as model)
  * [refactor] clean up relation prototype
  * [feature] added Model.prototype.DBRef helper
  * [feature] basic relations Graph
  * [example] graph relationships
  * [feature] Model.attributes configurable getter
  * [bug] Model/Graph constructor correctly calls initialize with all arguments
  * [feature] Graph#del supports `graph.del(model_instance)`
  * [feature] Graph#has supports `graph.has(model_instance)`
  * [feature] Graph#set supports `graph.set(model_instance)`
  * [refactor] Graph#set events
  * [bug] Graph#define not setting correct object
  * [bug] EmbeddedSchema.validate referencing wrong value
  * [feature] support for nested schemas
  * [bug] schema required/indexes support nonboolean indicators

0.2.4 / 2012-04-11 
==================

  * [clean] code cleanup
  * [bug] Graph using storage successfully
  * [refactor] Graph#extend to pass along store flag
  * [test] Graph#flag
  * [refactor] Graph#flags
  * [refactor] Schema#castAstype
  * [package] only node >= 0.6.x compatible now
  * [docs] schema comments
  * [bug] type noop setter
  * code cleanup
  * [refactor] model handles schema ensure index of `_id`.
  * [test] model test formatting
  * [refactor] model to use flags for storage of store, schema, type, parent
  * [test] Model#flag
  * [refactor] Model#flag
  * [test] added boolean schema type test
  * [feature] added boolean schema type
  * [bug] schema existence datum checks
  * Merge branch 'feature/schema-latlng'
  * [tests] geospatial schema type
  * [feature] added geospatial schema type

0.2.3 / 2012-03-26 
==================

  * tests for Graph#each
  * [bug] graph#each crash with type

0.2.2 / 2012-03-14 
==================

  * Docs cleanup.
  * Added Graph#has
  * added Model#has
  * schema validate path, model set uses Schema#validatePath

0.2.1 / 2012-03-09 
==================

  * temporarily ignore nested schemas
  * graph refresh lookups on pull
  * refactor graph.set to support models
  * test for kid as id
  * model id getter shows kid if no _id defined
  * tweak schema _id index defaults
  * indexes are not required for schema validation
  * [bug] Model#save - failure not defined on save fail

0.2.0 / 2012-02-26 
==================

  * few more tests and tweaks
  * tweak for Model toString() + tests
  * testing for custom error object
  * code cleanup for schema#validate
  * promise export mimics event emitter usage
  * utils imported as standard _ in hash
  * hash code cleaning
  * removed comparator helper export as now inline in hash
  * tests for refactored sort
  * refactored Hash#sort, added Hash#sortBy
  * added Hash#clean & Hash#flush
  * graph tests for filter
  * inline comments for graph filter
  * refactor Graph#filter
  * refactor Hash#select as Hash#filter
  * schema type tests compatible with id required
  * schema forces _id as index
  * remove unused schema functions
  * graph flag type getter
  * graph test flag events
  * test-cov / lib-cov in makefile are phony
  * tests 0.4.x compatible
  * accurate keys/values getters for hash
  * clean tests
  * hash length & set performance tweak
  * ;
  * refactor memory store for better remove performance
  * refactor memorystore bench
  * update matcha
  * crystal is cleaner
  * more tests
  * model tests for construction and get/set
  * added chai spies
  * model type can't be changed after constructed
  * Merge branch 'feature/graph-set-refactor'
  * memory store tests compatible with new graph#set format
  * graph tests compatible with new set format
  * graph set is #set(type, id, attrs)
  * Merge branch 'feature/modelschema'
  * model cleanup
  * model uses schema validation when available
  * schema supports indexes
  * query helper
  * tests for new set
  * model set is no path based, old set is called merge
  * test coverage support
  * comments
  * using EventEmitter drip implementation instead of requiring drip for each component
  * replacing delete with 'set' undefined
  * hash benchmarks
  * filter version bump
  * comments
  * Schema uses event emitter
  * drip as Event emitter
  * Merge branch 'feature/_id'
  * changed `id` to `_id`
  * read me [ci-skip]
  * memory store tests compatible with `length`
  * graph uses `length` instead of count
  * memory store has more appropriate object store
  * graph tests length fix
  * graph flush fix
  * graph comments
  * model comments
  * model comments
  * utils comments
  * copyright notices
  * storage comment updates
  * hash#has implemented
  * proper storage for hash data
  * make bench
  * tests fixed for hash
  * all hash commenting
  * change reporter for tests
  * read me updates on upcoming releases
  * few simple tests
  * benchmark updates

0.1.12 / 2012-01-28 
==================

  * removed all references to query, using 'filtr'
  * using filtr for querying
  * comment typos
  * remove filter tests

0.1.11 / 2012-01-24 
==================

  * crystal OS license attribute
  * object id example
  * expose named objected generators
  * added base/bits objectid generator "crystal"
  * Model supports deep addresses for 'get'
  * [bug] SeedError opts misreference
  * Model#fetch returns ENOTFOUND if storage engine returns null
  * SeedError moves opts.code to this.code as shortcut
  * README typos
  * few readme updates

0.1.10 / 2012-01-11 
==================

  * seed main exports rearranged
  * memory store uses oath directly
  * Drip as EventEmitter, with extend for easy API usage
  * git ignore vim swp

0.1.9 / 2012-01-09
==================

  * Merge branch 'feature/memorystore-graph'
  * added name to memory store for compatibility.
  * notes for memory store graph delete
  * more memory store tests
  * tests for memory store with graph
  * memory store fetch
  * graph#fetch defaults retrieved objects dirty to false
  * graph#set accepts options flag, but uses defaults
  * renamed ref to utils in graph to _
  * find each hash had backwards iterator
  * memory store uses SeedError
  * tests for memory store conform to using collections
  * memory store uses collections

0.1.8 / 2012-01-09
==================

  * Merge branch 'feature/store-upgrades'
  * model destroy success function requires no return value
  * store checks version
  * error accepts opts, and displays such
  * store passes options to initialize
  * added server dep
  * query is not a primary component [ci skip]
  * few more read me tweaks [ci skip]
  * read me updates [ci-skip]
  * Merge branch 'feature/custom-error'
  * example for custom error
  * export custom error
  * Seed Custom erro

0.1.7 / 2012-01-07
==================

  * update tests for graph#find
  * tests for graph.find
  * Graph removed select added find
  * added hash opts
  * implement hash#find using query constructor
  * remove old filter constructor
  * query code cleanup
  * Merge branch 'feature/merge-queryfilter'
  * moved filter tests to query, adjusted for test opts
  * allowed options for test
  * combined filter + query into query, untested
  * merged traversing methods for filter into parse and test
  * query data in exec
  * removed eyes sep from query example
  * Merge branch 'feature/query-refactor'
  * added query example
  * added Query
  * added $eq filter
  * test filenames conform to new object names (Filter // filters)
  * refactor Query as Filter as it is more appropriate.. makes way for actual Querying.
  * read me has travis badge
  * added travis.yml
  * read me updates
  * update link in package.json

0.1.6 / 2012-01-03
==================

  * major file rearranging
  * Merge branch 'feature/hash-filtering'
  * hash find + test
  * remove eyes inspector
  * detailed testing for Query
  * query testing
  * basic query functionality
  * expected query from main export
  * all hash filters for now
  * most helpers and tests
  * started filters and test
  * moved comparator to helpers folder
  * tests for Graph.flush
  * Graph.flush for all or by type
  * tests for graph.select
  * graph.select supports string and regex
  * empty graph tests for memory store
  * graph tests cleanup
  * Merge branch 'feature/memorystore-refactor'
  * comment cleanup
  * tests completed for model crud operations for memory store
  * Merge branch 'feature/memorystore-refactor' of github.com:qualiancy/seed into feature/memorystore-refactor
  * memorystore constructor test
  * MemoryStore require of Store is correct
  * memory store using hash
  * cleanup memory store nextTick and Promise usage
  * Store provide default initialize function
  * memory story refactored to extend style
  * cleaner memory store requires
  * Graph: getters all use defineProperty
  * Hash: all getters are defineProperty and cleanup of whitespace
  * using node.js inherits
  * seed utils a _ in model
  * Model getters/setters use Object.defineProperty
  * correctly importing drip for Model
  * removing model chain api as not compatible with drip 0.2.x
  * memorystore constructor test
  * MemoryStore require of Store is correct
  * memory store using hash
  * cleanup memory store nextTick and Promise usage
  * Store provide default initialize function
  * memory story refactored to extend style
  * cleaner memory store requires
  * Merge branch 'feature/util-refactor'
  * moved utils to utils folder, added loader
  * Merge branch 'feature/store-refactor'
  * Store tests
  * Store is now drip delimited and provides Oath helper
  * store main export as Store, not _Store
  * empty tests for memory
  * switched out should.js for chai should interface
  * update deps

0.1.5 / 2011-12-12
==================

  * update dependancies

0.1.4 / 2011-12-06
==================

  * graph supports drip 0.2.0
  * hash supports drip 0.2.0
  * model supports drip 0.2.0
  * tests support drip 0.2.0
  * benchmark, not benchmarks (makefile)
  * drip update
  * Merge branch 'feature/model-tests'
  * removed sherlock completely
  * benchmarks `matcha` 0.0.2 compatible
  * flag code cleanup
  * Merge branch 'master' of github.com:logicalparadox/seed into feature/model-tests
  * start of benchmarks
  * (makefile) benchmarks
  * added matcha + first benchmarks
  * added model test

0.1.3 / 2011-12-04
==================

  * schema example supports changes to types
  * schema tests for required and nested data
  * schema improved handling of required and omitted data
  * Merge branch 'feature/schema-types'
  * schema types defined w/ basic tests
  * schema typecasting refactored

0.1.2 / 2011-12-04
==================

  * Merge branch 'feature/mochatests'
  * added keywords to package.json
  * graph tests rewritten in mocha
  * graph flags new objects with type
  * hash test descriptor
  * data folder for testing not needed
  * we prefer dot notation
  * hash tests rewritten in mocha
  * hash map/select include index in iteration
  * toJSON is now `serialize` to match model function
  * model chain uses util correctly
  * main exports util.flake as object id
  * added mocha
  * chain removed tea
  * Merge branch 'feature/rmtea'
  * remove tea from store and memorystore
  * schema no tea
  * Graph, all tea references removed
  * util.inherits…. not util.merge
  * Hash#keys & Hash#values are getters, not functions
  * model code cleanup based on flag refactor
  * model - remove references to tea
  * Flake (time based uid generation) in utils
  * comparator whitespace
  * remove tea from hash
  * added utils
  * model comments
  * model uses model.store or model.parent.store for all db operations
  * move model getters/setters to prototype
  * package.json description update

0.1.1 / 2011-12-04
==================

  * whitespace cleanup
  * schema example comments
  * readme cleanup
  * README updates
  * clean model#set
  * schema cleanup
  * readme updates
  * code cleanup
  * Hash#__getters__ moved to prototype
  * Model/Graph #flag supports using an array as key
  * renamed submodules as index in respective folders

0.1.0 / 2011-11-11
==================

  * remove Collection (obsolete)
  * node version package typo

0.0.11 / 2011-11-11
==================

  * Graph#pull
  * Graph#push
  * Graph#set supports empty attributes
  * Graph#fetch is functional
  * Graph#all returns clone
  * graph defines parent for all models within
  * model has more generic `parent` attribute
  * query support
  * Graph#fetch
  * improved sync with query object

0.0.10 / 2011-11-02
==================

  * model set uses attrs, not props
  * Graph rebuild step 1 … get, set, del, each
  * changing storage semantics
  * Seed#ObjectId shortcut
  * cleaner tests for hash/graph
  * Hash#each uses allows context definition
  * Model flags use Hash
  * Seed#model - getter/setter for id, better type handling
  * collection note to sefl
  * Graphs also stores objects in collections
  * Schema uses required (not: `require`) to note path is not optional
  * Collection#push
  * Collection#fetch functional
  * Collection#push saves all models currently in memory to store
  * Collection#_refreshLookups & Collection#add uses it
  * iterator in Collection#each has context = null
  * improved opts/callback detecting in Model#save
  * Collection#count getter
  * improved Collection#add / Collection#fetch
  * Collection#each
  * Better model path handling
  * Collection uses uid (not uuid) for models
  * Model UID now model.uid not model.uuid
  * Small readme updates
  * one last readme typo
  * readme tweak
  * Big README update :)

0.0.9 / 2011-10-25
==================

  * Merge branch 'feature/schema'
  * Merge branch 'master' of github.com:logicalparadox/seed into feature/schema
  * Merge branch 'feature/rmFileStore'
  * moved filestore to npm `seed-filestore`
  * moved UID generator to `tea`
  * Schema type validation for custom types.
  * basic validation
  * Seed#Schema - path detection
  * Merge branch 'master' of github.com:logicalparadox/seed
  * Hash#max
  * Hash#max
  * Hash#min
  * Hash#--getter AVG
  * Hash#--getter SUM
  * sherlock 0.1.6 compatible tests (assert.isEmpty)
  * cleaner Hash#set
  * comparators and Hash#sort + tests
  * hash#values cleanup
  * Hash#clone
  * All Hash function now use this.each instead of for loops

0.0.8 / 2011-10-21
==================

  * Merge branch 'feature/hash'
  * all basic tests pass
  * Hash#keys uses native Object.keys, doh
  * tests Hash each / map / select
  * cleaning Hash#select
  * fixed hash#index function
  * Hash tests and data fixtures
  * Hash # select, key, values cleanup
  * Hash#index getter
  * hash events emit index or key, not full data
  * Added Hash
  * everything moved around
  * no event emitted on graph.remove is object doesn't exist
  * Graph#remove + tests
  * drip updated
  * Gragh#test cleanup
  * Graph#get
  * Merge branch 'feature/graph-tests'
  * graph test written in sherlock
  * package - sherlock for testing
  * Merge branch 'feature/graph'
  * can add models to graphs
  * improved model typing, customized extend function
  * improved model typing, customized extend function
  * Merge branch 'master' into feature/graph
  * Merge branch 'feature/model-type'
  * model understands type
  * basic use model as schema
  * graph initialized correctly
  * graph initializing
  * get/set/destroy of model for filestore
  * storing in folder based on model or collection path
  * better storage selection upon sync
  * added filestore
  * models bug - uid now in utils
  * tea 0.1.0 compatibility
  * capitalization
  * model requires definition of storage
  * moving uid generation into seed

0.0.7 / 2011-10-14
==================

  * collection uses tea, not utils
  * model uses tea, not utils
  * store uses tea, not utils
  * rewrite model chain api for set/serialize to behave more like jquery chains
  * removed utils, added tea to package
  * Cleaning chain api and some documentation
  * storage naming convention
  * MemoryStore documentation
  * store documentation
  * store defaults to collection store
  * comment cleanup
  * model doc updates based on storage change
  * better storage handling
  * comments / docs for models

0.0.6 / 2011-10-05
==================

  * models can chain
  * adding oath
  * memory storage engine implementing seed standard error codes
  * all model storage actions converted to callbacks
  * collection tests have different them than models
  * save, fetch, destroy converted from oaths to callbacks
  * utils isFunction
  * using sherlock for extra testing
  * collection beginnings: add/remove
  * test spies use sherlock
  * models using new uuid generator
  * better uuid generation - ms time  based
  * model is actually Model (caps)
  * utils no longer part of exports

0.0.5 / 2011-10-04
==================

  * memory#update
  * test cleanup
  * flag get false bugfix
  * model fetch, storage read
  * cleanup extra code
  * utils now has 'merge' and 'extend'
  * model.flag(key) & model.flag(key, value)
  * storage plugins are called engines
  * storage mod / memory transport support `remove`
  * model.destroy functional
  * model.save functional and tested
  * rewrite storage sync to work with oaths
  * convert transport/memory to promise (oath)
  * models get/set + events w/ tests
  * basics of storage engine
  * serialize models
  * unique id generator

0.0.4 / 2011-10-03
==================

  * refactored as model/collection factory
  * added drip
  * moving util extend to utils
  * npm ignore

0.0.3 / 2011-10-03
==================

  * constructor using unseeded function and tests

0.0.2 / 2011-10-03
==================

  * test formatting
  * define properties from constructor.prototype (allows after extend prototype changes)
  * package.json

0.0.1 / 2011-10-02
==================

  * bad constructor tests, tostring tests
  * basic object extends functionality and tests
  * initialize project
