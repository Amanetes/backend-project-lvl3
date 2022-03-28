install:
		npm ci
page-loader:
		node bin/page-loader.js
lint:
		npx eslint .
fix:
		npx eslint --fix .
test:
		npx jest
test-coverage:
		npx jest --coverage --coverageProvider=v8
test-debug:
		DEBUG=page-loader.* make test
test-debug-axios:
		DEBUG=axios make test
test-debug-nock:
		DEBUG=nock.* make test
publish:
		npm publish --dry-run