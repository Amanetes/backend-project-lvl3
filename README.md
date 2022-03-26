## Page Loader 📥
PageLoader is a command line utility that downloads pages from the internet and stores them on your computer. Along with the page it downloads all the resources (images, styles and js), allowing you to open the page without the Internet.

The same principle is used for saving pages in the browser.
## Hexlet tests and linter status:
[![Actions Status](https://github.com/Amanetes/backend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/Amanetes/backend-project-lvl3/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/6b95040ca19585061b6a/maintainability)](https://codeclimate.com/github/Amanetes/backend-project-lvl3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6b95040ca19585061b6a/test_coverage)](https://codeclimate.com/github/Amanetes/backend-project-lvl3/test_coverage)
[![Run Linter & Tests](https://github.com/Amanetes/backend-project-lvl3/actions/workflows/main.yml/badge.svg)](https://github.com/Amanetes/backend-project-lvl3/actions/workflows/main.yml)

## Installation:

1. Clone this repository 
```bash
git@github.com:Amanetes/backend-project-lvl3.git
```
2. Type `make install` 

3. Type `npm link`
____

**Program options:**

- Type `page-loader -h` to display help for command
- Type `page-loader -o` to specify an output folder
- Type `page-loader -V` to output the version number


| Option |Description|
| :--- |:----:|
| -V, --version | output the version number|
| -f, --format [type] |output dir (default: 'current working directory')|
| -h, --help |display help for command|



## Download HTML page from URL
