
TESTS = test/*.js
REPORTER = dot
BENCHMARKS = benchmarks/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(TESTS)

benchmarks:
	@NODE_ENV=test ./node_modules/.bin/matcha $(BENCHMARKS)

.PHONY: test benchmarks