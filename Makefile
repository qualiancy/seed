
TESTS = test/*.js
REPORTER = spec
BENCHMARKS = benchmarks/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

bench:
	@NODE_ENV=test ./node_modules/.bin/matcha $(BENCHMARKS)

.PHONY: test bench
