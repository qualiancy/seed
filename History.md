
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
