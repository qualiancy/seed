
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
