
TESTS = test/*.js
REPORTER = list

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(TESTS)

.PHONY: test