install:
	npm ci
lint:
	npx eslint .
fix:
	npx eslint --fix .
test:
	npx jest
test-coverage:
	npx jest --coverage --coverageProvider=v8
publish:
	npm publish --dry-run

.PHONY: test